import type { DetectionEvent, ReactionConfig } from "../type";

export function runReaction(reaction: ReactionConfig, event: DetectionEvent, debug: boolean) {
  try {
    if (reaction.mode === "callback") {
      reaction.onDetect(event);
      return;
    }
    if (reaction.mode === "redirect") {
      window.location.href = reaction.redirectUrl;
      return;
    }
    if (reaction.mode === "rewrite") {
      document.documentElement.innerHTML = reaction.rewriteHTML;
    }
  } catch (error) {
    if (debug) console.debug("[nodevtool] reaction failed", error);
  }
}
