import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./supabase-storage";
import { CHANNELS, generateChannelCopy, type Channel } from "./services/social/generate";
import { publishToFacebook, publishToInstagram } from "./services/social/meta";
import { sendWhatsAppMessage, buildWhatsAppShareLink } from "./services/social/whatsapp";
import { sendMarketingEmail } from "./services/social/email";

// Mirrors the exact check used by /api/admin/login and /api/admin/verify in
// server/routes.ts: decode the base64 "id:email" token, then confirm that
// id/email pair matches a real row in admin_users. No separate hardcoded
// email list here — this stays in sync with whoever is actually in the
// admin_users table, including anyone added or removed later.
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ error: "Admin authentication required" });
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId, email] = decoded.split(":");
    if (!userId || !email) {
      return res.status(401).json({ error: "Invalid admin token" });
    }

    const adminUser = await storage.getAdminUserByEmail(email);
    if (!adminUser || adminUser.id !== userId) {
      return res.status(401).json({ error: "Invalid admin token" });
    }

    next();
  } catch {
    return res.status(401).json({ error: "Invalid admin token" });
  }
}

async function logPublishAttempt(params: {
  postId: string;
  postTitle: string;
  channel: string;
  status: "published" | "failed" | "not_configured";
  detail: string;
  externalId?: string;
}) {
  try {
    await storage.createSocialPublishLogEntry({
      postId: params.postId,
      postTitle: params.postTitle,
      channel: params.channel,
      status: params.status,
      detail: params.detail,
      externalId: params.externalId,
    } as any);
  } catch (err) {
    // Logging failures shouldn't block the response to the admin
    console.error("Failed to write social publish log entry:", err);
  }
}

export function registerSocialRoutes(app: Express) {
  // ── Posts ──────────────────────────────────────────────────────────────

  // List all posts with their channel versions attached
  app.get("/api/social/posts", requireAdmin, async (_req, res) => {
    try {
      const posts = await storage.getSocialPosts();
      const withVersions = await Promise.all(
        posts.map(async (post: any) => ({
          ...post,
          versions: await storage.getSocialPostVersions(post.id),
        }))
      );
      res.json(withVersions);
    } catch (error) {
      console.error("Failed to load social posts:", error);
      res.status(500).json({ error: "Failed to load posts" });
    }
  });

  // Create a new master post and auto-generate a first draft for every channel
  app.post("/api/social/posts", requireAdmin, async (req, res) => {
    try {
      const { title, source, focus, master, story, date } = req.body;
      if (!title || !master) {
        return res.status(400).json({ error: "title and master are required" });
      }

      const post = await storage.createSocialPost({
        title,
        source: source || "scratch",
        focus: focus || null,
        master,
        story: story || "",
        status: "draft",
        scheduledFor: date ? new Date(date) : null,
      } as any);

      const versions = await Promise.all(
        CHANNELS.map((channel) =>
          storage.upsertSocialPostVersion({
            postId: post.id,
            channel,
            content: generateChannelCopy(channel, title, master, story || ""),
            approved: false,
          } as any)
        )
      );

      res.status(201).json({ ...post, versions });
    } catch (error) {
      console.error("Failed to create social post:", error);
      res.status(500).json({ error: "Failed to create post" });
    }
  });

  // Update post-level fields (title, master, story, focus, status, schedule)
  app.patch("/api/social/posts/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updateSocialPost(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Post not found" });
      res.json(updated);
    } catch (error) {
      console.error("Failed to update social post:", error);
      res.status(500).json({ error: "Failed to update post" });
    }
  });

  app.delete("/api/social/posts/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteSocialPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Failed to delete social post:", error);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });

  // ── Channel versions ──────────────────────────────────────────────────

  // Regenerate (or hand-edit) one channel's copy from the master story
  app.post("/api/social/generate", requireAdmin, async (req, res) => {
    try {
      const { postId, channel, title, master, story } = req.body;
      if (!postId || !channel) {
        return res.status(400).json({ error: "postId and channel are required" });
      }
      if (!CHANNELS.includes(channel)) {
        return res.status(400).json({ error: `channel must be one of: ${CHANNELS.join(", ")}` });
      }

      const content = generateChannelCopy(channel as Channel, title || "", master || "", story || "");
      const version = await storage.upsertSocialPostVersion({
        postId,
        channel,
        content,
        approved: false,
      } as any);

      res.json(version);
    } catch (error) {
      console.error("Failed to generate channel copy:", error);
      res.status(500).json({ error: "Failed to generate channel copy" });
    }
  });

  // Save a hand-edited channel version (editing always clears approval)
  app.put("/api/social/posts/:id/versions/:channel", requireAdmin, async (req, res) => {
    try {
      const { content } = req.body;
      const version = await storage.upsertSocialPostVersion({
        postId: req.params.id,
        channel: req.params.channel,
        content,
        approved: false,
      } as any);
      res.json(version);
    } catch (error) {
      console.error("Failed to save channel version:", error);
      res.status(500).json({ error: "Failed to save channel version" });
    }
  });

  // Approve a specific channel version
  app.post("/api/social/approve", requireAdmin, async (req, res) => {
    try {
      const { postId, channel, content } = req.body;
      if (!postId || !channel) {
        return res.status(400).json({ error: "postId and channel are required" });
      }
      const version = await storage.upsertSocialPostVersion({
        postId,
        channel,
        content,
        approved: true,
      } as any);
      res.json(version);
    } catch (error) {
      console.error("Failed to approve channel version:", error);
      res.status(500).json({ error: "Failed to approve channel version" });
    }
  });

  // Schedule a post (sets status + scheduled_for; actual dispatch at the
  // scheduled time would be driven by a cron/queue calling the publish
  // endpoints below — not included here since it needs a task runner).
  app.post("/api/social/schedule", requireAdmin, async (req, res) => {
    try {
      const { postId, date } = req.body;
      if (!postId || !date) {
        return res.status(400).json({ error: "postId and date are required" });
      }
      const updated = await storage.updateSocialPost(postId, {
        status: "scheduled",
        scheduledFor: new Date(date),
      } as any);
      if (!updated) return res.status(404).json({ error: "Post not found" });
      res.json(updated);
    } catch (error) {
      console.error("Failed to schedule post:", error);
      res.status(500).json({ error: "Failed to schedule post" });
    }
  });

  // ── Publishing ────────────────────────────────────────────────────────
  // Every one of these: validates the approved channel version exists,
  // calls the provider service, then writes a Publishing Log entry
  // regardless of outcome (published / failed / not_configured).

  app.post("/api/social/facebook/publish", requireAdmin, async (req, res) => {
    const { postId, link } = req.body;
    const post = await storage.getSocialPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const versions = await storage.getSocialPostVersions(postId);
    const version = versions.find((v: any) => v.channel === "Facebook");
    if (!version) return res.status(400).json({ error: "No Facebook version found for this post" });

    const result = await publishToFacebook({ message: version.content, link });
    await logPublishAttempt({
      postId,
      postTitle: post.title,
      channel: "Facebook",
      status: result.status,
      detail: result.detail,
      externalId: result.externalId,
    });
    res.status(result.ok ? 200 : 422).json(result);
  });

  app.post("/api/social/instagram/publish", requireAdmin, async (req, res) => {
    const { postId, imageUrl } = req.body;
    const post = await storage.getSocialPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const versions = await storage.getSocialPostVersions(postId);
    const version = versions.find((v: any) => v.channel === "Instagram");
    if (!version) return res.status(400).json({ error: "No Instagram version found for this post" });

    const result = await publishToInstagram({ caption: version.content, imageUrl });
    await logPublishAttempt({
      postId,
      postTitle: post.title,
      channel: "Instagram",
      status: result.status,
      detail: result.detail,
      externalId: result.externalId,
    });
    res.status(result.ok ? 200 : 422).json(result);
  });

  app.post("/api/social/whatsapp/send", requireAdmin, async (req, res) => {
    const { postId, to } = req.body;
    const post = await storage.getSocialPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const versions = await storage.getSocialPostVersions(postId);
    const version = versions.find((v: any) => v.channel === "WhatsApp");
    if (!version) return res.status(400).json({ error: "No WhatsApp version found for this post" });

    const result = await sendWhatsAppMessage({ to, message: version.content });
    await logPublishAttempt({
      postId,
      postTitle: post.title,
      channel: "WhatsApp",
      status: result.status,
      detail: result.detail,
      externalId: result.externalId,
    });
    res.status(result.ok ? 200 : 422).json(result);
  });

  // Non-sending helper: builds a wa.me share link for the "Copy / Share via
  // WhatsApp" admin-controlled pattern from the plan, instead of blasting
  // a message to everybody automatically.
  app.get("/api/social/whatsapp/share-link/:postId", requireAdmin, async (req, res) => {
    const versions = await storage.getSocialPostVersions(req.params.postId);
    const version = versions.find((v: any) => v.channel === "WhatsApp");
    if (!version) return res.status(400).json({ error: "No WhatsApp version found for this post" });
    res.json({ link: buildWhatsAppShareLink(version.content) });
  });

  app.post("/api/social/email/send", requireAdmin, async (req, res) => {
    const { postId, to } = req.body;
    const post = await storage.getSocialPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const versions = await storage.getSocialPostVersions(postId);
    const version = versions.find((v: any) => v.channel === "Email");
    if (!version) return res.status(400).json({ error: "No Email version found for this post" });

    const [firstLine, ...rest] = version.content.split("\n");
    const subject = firstLine.replace(/^Subject:\s*/i, "") || post.title;

    const result = await sendMarketingEmail({
      to: to || process.env.EMAIL_FROM_ADDRESS || "",
      subject,
      body: rest.join("\n").trim(),
    });
    await logPublishAttempt({
      postId,
      postTitle: post.title,
      channel: "Email",
      status: result.status,
      detail: result.detail,
      externalId: result.externalId,
    });
    res.status(result.ok ? 200 : 422).json(result);
  });

  // ── Publishing log ────────────────────────────────────────────────────

  app.get("/api/social/publish-log", requireAdmin, async (_req, res) => {
    try {
      const log = await storage.getSocialPublishLog();
      res.json(log);
    } catch (error) {
      console.error("Failed to load publish log:", error);
      res.status(500).json({ error: "Failed to load publish log" });
    }
  });
}
