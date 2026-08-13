// Turns one master story into channel-appropriate copy.
//
// This is a template-based generator so Content & Social works with zero
// external dependencies out of the box. To upgrade to AI-generated copy,
// swap the body of `generateChannelCopy` for a call to your model of choice
// (e.g. the Anthropic API) using `channelGuidance[channel]` as the system
// prompt — the function signature and callers don't need to change.

export type Channel = "Blog" | "Instagram" | "Facebook" | "WhatsApp" | "Email";

export const CHANNELS: Channel[] = ["Blog", "Instagram", "Facebook", "WhatsApp", "Email"];

export const channelGuidance: Record<Channel, string> = {
  Blog: "Full, useful article with a clear title, introduction, sections, SEO-friendly wording and a website call to action.",
  Instagram: "Short visual-first caption, concise storytelling, natural call to action and a small set of relevant hashtags.",
  Facebook: "Conversational community post with enough context to explain why the story matters, plus a link or call to action.",
  WhatsApp: "Short, personal and easy to forward. Keep the key information, availability and link without sounding like an advert.",
  Email: "Clear subject-style opening, useful context, short story and one strong call to action.",
};

export function generateChannelCopy(
  channel: Channel,
  title: string,
  master: string,
  story: string
): string {
  const clean = (master || "").trim();
  const short = clean.length > 280 ? clean.slice(0, 277).trimEnd() + "..." : clean;
  const supportingStory = (story || "").trim();

  switch (channel) {
    case "Blog":
      return `${title}\n\n${clean}\n\n${supportingStory}`;
    case "Instagram":
      return `🌱 ${title}\n\n${short}\n\n${supportingStory}\n\n#LittleForests #IndigenousTrees #WaterSourceRestoration`;
    case "Facebook":
      return `${clean}\n\n${supportingStory}\n\nFollow Little Forests for more updates on tree planting and water-source restoration.`;
    case "WhatsApp":
      return `🌱 ${title}\n\n${short}\n\nLearn more: littleforest.co.ke`;
    case "Email":
    default:
      return `Subject: ${title}\n\n${short}\n\n${supportingStory}\n\nLearn more about Little Forests: littleforest.co.ke`;
  }
}
