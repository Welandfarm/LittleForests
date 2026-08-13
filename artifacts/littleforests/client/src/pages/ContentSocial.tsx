import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

type Channel = "Blog" | "Instagram" | "Facebook" | "WhatsApp" | "Email";
type SourceType = "scratch" | "product" | "website";
type Status = "draft" | "ready" | "approved" | "scheduled" | "published";

type ChannelVersion = {
  id?: string;
  channel: Channel;
  content: string;
  approved: boolean;
};

type ContentItem = {
  id: string;
  title: string;
  source: SourceType;
  focus: string;
  scheduledFor: string | null;
  status: Status;
  master: string;
  story: string;
  versions: ChannelVersion[];
};

type PublishLogEntry = {
  id: string;
  postId: string;
  postTitle: string;
  channel: string;
  status: "published" | "failed" | "not_configured";
  detail: string;
  externalId?: string;
  createdAt: string;
};

const channelGuidance: Record<Channel, string> = {
  Blog: "Full, useful article with a clear title, introduction, sections, SEO-friendly wording and a website call to action.",
  Instagram: "Short visual-first caption, concise storytelling, natural call to action and a small set of relevant hashtags.",
  Facebook: "Conversational community post with enough context to explain why the story matters, plus a link or call to action.",
  WhatsApp: "Short, personal and easy to forward. Keep the key information, availability and link without sounding like an advert.",
  Email: "Clear subject-style opening, useful context, short story and one strong call to action.",
};

const channels: Channel[] = ["Blog", "Instagram", "Facebook", "WhatsApp", "Email"];

function normalizePost(raw: any): ContentItem {
  return {
    id: raw.id,
    title: raw.title,
    source: (raw.source || "scratch") as SourceType,
    focus: raw.focus || "",
    scheduledFor: raw.scheduled_for || raw.scheduledFor || null,
    status: (raw.status || "draft") as Status,
    master: raw.master || "",
    story: raw.story || "",
    versions: (raw.versions || []).map((v: any) => ({
      id: v.id,
      channel: v.channel as Channel,
      content: v.content || "",
      approved: Boolean(v.approved),
    })),
  };
}

function statusLabel(status: Status): string {
  switch (status) {
    case "draft": return "Draft";
    case "ready": return "Ready for review";
    case "approved": return "Approved";
    case "scheduled": return "Scheduled";
    case "published": return "Published";
    default: return status;
  }
}

export default function ContentSocial() {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["social-posts"],
    queryFn: async () => {
      const raw = (await apiClient.getSocialPosts()) as any[];
      return raw.map(normalizePost);
    },
  });

  const logQuery = useQuery({
    queryKey: ["social-publish-log"],
    queryFn: () => apiClient.getPublishLog() as Promise<PublishLogEntry[]>,
  });

  const items = postsQuery.data ?? [];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel>("Instagram");
  const [showComposer, setShowComposer] = useState(false);
  const [showLog, setShowLog] = useState(false);

  const [title, setTitle] = useState("");
  const [master, setMaster] = useState("");
  const [story, setStory] = useState("");
  const [source, setSource] = useState<SourceType>("scratch");
  const [date, setDate] = useState("");

  const [draftContent, setDraftContent] = useState<string>("");
  const [instagramImageUrl, setInstagramImageUrl] = useState("");
  const [whatsappTo, setWhatsappTo] = useState("");
  const [emailTo, setEmailTo] = useState("");
  const [actionMessage, setActionMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!selectedId && items.length > 0) setSelectedId(items[0].id);
  }, [items, selectedId]);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  useEffect(() => {
    if (!selected) return;
    const version = selected.versions.find((v) => v.channel === activeChannel);
    setDraftContent(version?.content ?? "");
  }, [selected?.id, activeChannel, selected?.versions]);

  const counts = useMemo(
    () => ({
      drafts: items.filter((x) => x.status === "draft").length,
      scheduled: items.filter((x) => x.status === "scheduled").length,
      published: items.filter((x) => x.status === "published").length,
    }),
    [items]
  );

  function refreshPosts() {
    queryClient.invalidateQueries({ queryKey: ["social-posts"] });
  }
  function refreshLog() {
    queryClient.invalidateQueries({ queryKey: ["social-publish-log"] });
  }

  const createMutation = useMutation({
    mutationFn: () =>
      apiClient.createSocialPost({
        title: title.trim(),
        source,
        focus: source === "scratch" ? "" : source,
        master: master.trim(),
        story: story.trim(),
        date: date || undefined,
      }),
    onSuccess: (created: any) => {
      refreshPosts();
      setSelectedId(created.id);
      setActiveChannel("Instagram");
      setTitle("");
      setMaster("");
      setStory("");
      setDate("");
      setShowComposer(false);
    },
    onError: (err: any) => setActionMessage({ tone: "error", text: err.message || "Could not create content" }),
  });

  const generateMutation = useMutation({
    mutationFn: (channel: Channel) =>
      apiClient.generateChannelVersion({
        postId: selected.id,
        channel,
        title: selected.title,
        master: selected.master,
        story: selected.story,
      }),
    onSuccess: () => refreshPosts(),
    onError: (err: any) => setActionMessage({ tone: "error", text: err.message || "Regenerate failed" }),
  });

  const saveMutation = useMutation({
    mutationFn: () => apiClient.saveChannelVersion(selected.id, activeChannel, draftContent),
    onSuccess: () => refreshPosts(),
    onError: (err: any) => setActionMessage({ tone: "error", text: err.message || "Save failed" }),
  });

  const approveMutation = useMutation({
    mutationFn: () =>
      apiClient.approveChannelVersion({ postId: selected.id, channel: activeChannel, content: draftContent }),
    onSuccess: () => {
      refreshPosts();
      setActionMessage({ tone: "success", text: `${activeChannel} version approved.` });
    },
    onError: (err: any) => setActionMessage({ tone: "error", text: err.message || "Approve failed" }),
  });

  const scheduleMutation = useMutation({
    mutationFn: (isoDate: string) => apiClient.scheduleSocialPost(selected.id, isoDate),
    onSuccess: () => {
      refreshPosts();
      setActionMessage({ tone: "success", text: "Post scheduled." });
    },
    onError: (err: any) => setActionMessage({ tone: "error", text: err.message || "Schedule failed" }),
  });

  function makePublishMutation(
    fn: (postId: string) => Promise<any>,
    channelLabel: string
  ) {
    return useMutation({
      mutationFn: () => fn(selected.id),
      onSuccess: (result: any) => {
        refreshLog();
        setActionMessage({
          tone: result.ok ? "success" : "error",
          text: `${channelLabel}: ${result.detail}`,
        });
      },
      onError: (err: any) =>
        setActionMessage({ tone: "error", text: err.message || `${channelLabel} publish failed` }),
    });
  }

  const publishFacebook = makePublishMutation((id) => apiClient.publishToFacebook(id), "Facebook");
  const publishInstagram = makePublishMutation(
    (id) => apiClient.publishToInstagram(id, instagramImageUrl.trim() || undefined),
    "Instagram"
  );
  const sendWhatsApp = makePublishMutation(
    (id) => apiClient.sendWhatsApp(id, whatsappTo.trim() || undefined),
    "WhatsApp"
  );
  const sendEmail = makePublishMutation(
    (id) => apiClient.sendMarketingEmail(id, emailTo.trim() || undefined),
    "Email"
  );

  if (postsQuery.isLoading) {
    return (
      <main className="min-h-screen bg-white p-10 text-sm text-[#6B7280]">Loading Content & Social…</main>
    );
  }

  if (!selected) {
    return (
      <main className="min-h-screen bg-white text-[#111827]">
        <div className="mx-auto max-w-3xl px-5 py-10 text-center">
          <h1 className="text-2xl font-extrabold">Content & Social</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            No content yet. Create your first master story and it'll be automatically prepared for every channel.
          </p>
          <button
            type="button"
            onClick={() => setShowComposer(true)}
            className="mt-5 rounded-full bg-[#F97316] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#EA580C]"
          >
            + Create content
          </button>
        </div>
        {showComposer && (
          <Composer
            title={title} setTitle={setTitle}
            master={master} setMaster={setMaster}
            story={story} setStory={setStory}
            source={source} setSource={setSource}
            date={date} setDate={setDate}
            onCancel={() => setShowComposer(false)}
            onSubmit={() => createMutation.mutate()}
            saving={createMutation.isPending}
          />
        )}
      </main>
    );
  }

  const activeVersion = selected.versions.find((v) => v.channel === activeChannel);
  const publishBusy =
    publishFacebook.isPending || publishInstagram.isPending || sendWhatsApp.isPending || sendEmail.isPending;

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#111827]">
      <div className="mx-auto max-w-7xl px-5 py-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#EA580C]">Admin</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Content & Social</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4B5563]">
              Create one master story, then prepare a version that fits each channel. Nothing is published
              externally until the admin approves it — and publishing calls your backend, which talks to
              Meta, WhatsApp, and email on your behalf.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowLog((v) => !v)}
              className="rounded-full border border-[#D1D5DB] px-5 py-3 text-sm font-extrabold text-[#374151] hover:bg-[#F9FAFB]"
            >
              {showLog ? "Hide" : "View"} publishing log
            </button>
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              className="rounded-full bg-[#F97316] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#EA580C]"
            >
              + Create content
            </button>
          </div>
        </div>

        {actionMessage && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 text-sm font-semibold ${
              actionMessage.tone === "success"
                ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534]"
                : "border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]"
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {showLog && (
          <section className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[#6B7280]">Publishing log</div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Content</th>
                    <th className="py-2 pr-4">Channel</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {(logQuery.data ?? []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-xs text-[#6B7280]">
                        No publish attempts yet. They'll show up here as soon as you publish or send a channel version.
                      </td>
                    </tr>
                  )}
                  {(logQuery.data ?? []).map((entry) => (
                    <tr key={entry.id} className="border-b border-[#F3F4F6] align-top">
                      <td className="py-2 pr-4 text-xs text-[#6B7280]">
                        {new Date(entry.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 font-semibold">{entry.postTitle}</td>
                      <td className="py-2 pr-4">{entry.channel}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                            entry.status === "published"
                              ? "bg-[#F0FDF4] text-[#166534]"
                              : entry.status === "not_configured"
                              ? "bg-[#FFF7ED] text-[#9A3412]"
                              : "bg-[#FEF2F2] text-[#991B1B]"
                          }`}
                        >
                          {entry.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-[#4B5563]">{entry.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Content items", items.length],
            ["Drafts", counts.drafts],
            ["Scheduled", counts.scheduled],
            ["Published", counts.published],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">{label}</div>
              <div className="mt-2 text-3xl font-extrabold">{value}</div>
            </div>
          ))}
        </div>

        <section className="mt-6 grid gap-5 lg:grid-cols-[330px_1fr]">
          <aside className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="mb-3 text-xs font-extrabold uppercase tracking-wide text-[#6B7280]">
              Content calendar
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setActiveChannel("Instagram");
                    setActionMessage(null);
                  }}
                  className={`w-full rounded-xl border p-4 text-left ${
                    selected.id === item.id
                      ? "border-[#16A34A] bg-[#F0FDF4]"
                      : "border-[#E5E7EB] hover:bg-[#FFFFFF]"
                  }`}
                >
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="mt-1 text-xs text-[#6B7280]">
                    {item.focus || "—"} · {item.scheduledFor ? new Date(item.scheduledFor).toLocaleDateString() : "Not scheduled"}
                  </div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#EA580C]">
                    {statusLabel(item.status)}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Master content</p>
                <h2 className="mt-1 text-xl font-extrabold">{selected.title}</h2>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Source: {selected.source} · Focus: {selected.focus || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs"
                  onChange={(e) => e.target.value && scheduleMutation.mutate(e.target.value)}
                />
                <button
                  type="button"
                  disabled={generateMutation.isPending}
                  onClick={() => channels.forEach((c) => generateMutation.mutate(c))}
                  className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-xs font-extrabold hover:bg-[#F1F5F9] disabled:opacity-50"
                >
                  Regenerate all channels
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#F1F5F9] p-4">
              <div className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Master story</div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{selected.master}</p>
              {selected.story && (
                <>
                  <div className="mt-4 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                    Background story
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4B5563]">{selected.story}</p>
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
                {channels.map((channel) => {
                  const version = selected.versions.find((x) => x.channel === channel);
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => {
                        setActiveChannel(channel);
                        setActionMessage(null);
                      }}
                      className={`rounded-full px-3 py-2 text-xs font-bold ${
                        activeChannel === channel ? "bg-[#16A34A] text-white" : "bg-[#F1F5F9] text-[#4B5563]"
                      }`}
                    >
                      {channel}
                      {version?.approved ? " ✓" : ""}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-extrabold">{activeChannel} version</h3>
                    <p className="mt-1 text-xs text-[#6B7280]">{channelGuidance[activeChannel]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => generateMutation.mutate(activeChannel)}
                      disabled={generateMutation.isPending}
                      className="rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      {generateMutation.isPending ? "Regenerating…" : "Regenerate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                      className="rounded-xl border border-[#D1D5DB] px-3 py-2 text-xs font-bold disabled:opacity-50"
                    >
                      {saveMutation.isPending ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate()}
                      disabled={approveMutation.isPending}
                      className="rounded-xl bg-[#16A34A] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                    >
                      {activeVersion?.approved ? "Approved ✓" : approveMutation.isPending ? "Approving…" : "Approve"}
                    </button>
                  </div>
                </div>

                <textarea
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  className="mt-4 min-h-[260px] w-full rounded-xl border border-[#D1D5DB] px-4 py-4 text-sm leading-6 outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#E5E7EB] p-4">
              <div className="text-sm font-bold">Publishing</div>
              <div className="mt-1 text-xs text-[#6B7280]">
                Each button below only works once the matching channel version is approved and its account
                credentials are set on the server (see .env.example). Until then you'll get a clear
                "not configured" message instead of a silent failure.
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
                    Instagram image/video URL
                  </span>
                  <input
                    value={instagramImageUrl}
                    onChange={(e) => setInstagramImageUrl(e.target.value)}
                    placeholder="https://…/photo.jpg"
                    className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#16A34A]"
                  />
                </label>
                <label>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
                    WhatsApp recipient (E.164)
                  </span>
                  <input
                    value={whatsappTo}
                    onChange={(e) => setWhatsappTo(e.target.value)}
                    placeholder="2547XXXXXXXX"
                    className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#16A34A]"
                  />
                </label>
                <label>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
                    Email recipient (optional)
                  </span>
                  <input
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="list@littleforest.co.ke"
                    className="mt-1 w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs outline-none focus:border-[#16A34A]"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={publishBusy}
                  onClick={() => publishFacebook.mutate()}
                  className="rounded-full bg-[#1877F2] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {publishFacebook.isPending ? "Publishing…" : "Publish to Facebook"}
                </button>
                <button
                  type="button"
                  disabled={publishBusy}
                  onClick={() => publishInstagram.mutate()}
                  className="rounded-full bg-[#E1306C] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {publishInstagram.isPending ? "Publishing…" : "Publish to Instagram"}
                </button>
                <button
                  type="button"
                  disabled={publishBusy}
                  onClick={() => sendWhatsApp.mutate()}
                  className="rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {sendWhatsApp.isPending ? "Sending…" : "Send via WhatsApp"}
                </button>
                <button
                  type="button"
                  disabled={publishBusy}
                  onClick={() => sendEmail.mutate()}
                  className="rounded-full bg-[#F97316] px-4 py-2.5 text-xs font-extrabold text-white disabled:opacity-50"
                >
                  {sendEmail.isPending ? "Sending…" : "Send email"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {showComposer && (
          <Composer
            title={title} setTitle={setTitle}
            master={master} setMaster={setMaster}
            story={story} setStory={setStory}
            source={source} setSource={setSource}
            date={date} setDate={setDate}
            onCancel={() => setShowComposer(false)}
            onSubmit={() => createMutation.mutate()}
            saving={createMutation.isPending}
          />
        )}
      </div>
    </main>
  );
}

function Composer(props: {
  title: string; setTitle: (v: string) => void;
  master: string; setMaster: (v: string) => void;
  story: string; setStory: (v: string) => void;
  source: SourceType; setSource: (v: SourceType) => void;
  date: string; setDate: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  saving: boolean;
}) {
  const { title, setTitle, master, setMaster, story, setStory, source, setSource, date, setDate, onCancel, onSubmit, saving } = props;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/50 p-5">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#EA580C]">Create</p>
            <h2 className="mt-1 text-2xl font-extrabold">Master content</h2>
            <p className="mt-1 text-xs text-[#6B7280]">
              Write once. We'll prepare a first draft for every channel automatically.
            </p>
          </div>
          <button type="button" onClick={onCancel} className="text-2xl text-[#6B7280]">×</button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["scratch", "From scratch"],
              ["product", "From a product"],
              ["website", "From website content"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSource(key as SourceType)}
                className={`rounded-xl border p-4 text-left text-sm font-bold ${
                  source === key ? "border-[#16A34A] bg-[#F0FDF4] text-[#166534]" : "border-[#E5E7EB]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <label>
            <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Indigenous trees for water-source restoration"
              className="mt-2 w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm outline-none focus:border-[#16A34A]"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Master story</span>
            <textarea
              value={master}
              onChange={(e) => setMaster(e.target.value)}
              rows={7}
              placeholder="Write the factual story here. This is the source from which channel versions are prepared."
              className="mt-2 w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm leading-6 outline-none focus:border-[#16A34A]"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Background story / context</span>
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={5}
              placeholder="Add the background, project context, product story or availability information."
              className="mt-2 w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm leading-6 outline-none focus:border-[#16A34A]"
            />
          </label>

          <label>
            <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Date (optional)</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-xl border border-[#D1D5DB] px-5 py-3 text-sm font-bold">
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving || !title.trim() || !master.trim()}
            className="rounded-xl bg-[#F97316] px-5 py-3 text-sm font-extrabold text-white disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create & prepare channels"}
          </button>
        </div>
      </div>
    </div>
  );
}
