/** Minimal shape of a Tiptap/ProseMirror JSON document node. */
interface TiptapNode {
  type?: string;
  text?: string;
  content?: TiptapNode[];
}

/** Walks a Tiptap JSON document and concatenates its text nodes. */
export function extractPlainText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const node = doc as TiptapNode;
  const own = node.text ?? "";
  const children = node.content?.map(extractPlainText).join(" ") ?? "";
  return [own, children].filter(Boolean).join(" ");
}

const WORDS_PER_MINUTE = 200;

/** Reading time in whole minutes, minimum 1 (§18: calculated automatically from content). */
export function calculateReadingTime(doc: unknown): number {
  const wordCount = extractPlainText(doc)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}
