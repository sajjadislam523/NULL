import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Renders a Tiptap/ProseMirror JSON document as styled JSX — used by both
 * the admin editor's live preview and the public article page (§19, §28),
 * so "preview matches the real article" holds by construction rather than
 * by two implementations staying in sync. Deliberately not exhaustive of
 * every possible Tiptap extension — just the node/mark types the editor
 * toolbar (components/editor/RichTextEditor.tsx) actually produces.
 */

interface TiptapMark {
    type: string;
    attrs?: Record<string, unknown>;
}

interface TiptapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TiptapNode[];
    text?: string;
    marks?: TiptapMark[];
}

function renderMarks(text: string, marks: TiptapMark[] = []): ReactNode {
    return marks.reduce<ReactNode>((acc, mark) => {
        switch (mark.type) {
            case "bold":
                return <strong className="text-foreground">{acc}</strong>;
            case "italic":
                return <em>{acc}</em>;
            case "strike":
                return <s>{acc}</s>;
            case "code":
                return (
                    <code className="rounded-xs border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
                        {acc}
                    </code>
                );
            case "link":
                return (
                    <a
                        href={String(mark.attrs?.href ?? "#")}
                        target={
                            mark.attrs?.target === "_blank"
                                ? "_blank"
                                : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-foreground underline underline-offset-2 transition-colors duration-base hover:text-foreground-secondary"
                    >
                        {acc}
                    </a>
                );
            default:
                return acc;
        }
    }, text);
}

function renderInline(
    nodes: TiptapNode[] = [],
    keyPrefix: string,
): ReactNode[] {
    return nodes.map((node, i) => {
        const key = `${keyPrefix}-${i}`;
        if (node.type === "text")
            return (
                <span key={key}>
                    {renderMarks(node.text ?? "", node.marks)}
                </span>
            );
        if (node.type === "hardBreak") return <br key={key} />;
        return null;
    });
}

function renderChildren(
    nodes: TiptapNode[] | undefined,
    keyPrefix: string,
): ReactNode[] {
    return (nodes ?? []).map((node, i) =>
        renderNode(node, `${keyPrefix}-${i}`),
    );
}

function renderNode(node: TiptapNode, key: string): ReactNode {
    switch (node.type) {
        case "paragraph":
            return (
                <p
                    key={key}
                    className="mb-5 leading-relaxed text-foreground-secondary"
                >
                    {renderInline(node.content, key)}
                </p>
            );
        case "heading": {
            const level = Math.min(
                4,
                Math.max(2, (node.attrs?.level as number) ?? 2),
            );
            const className =
                "mb-4 mt-10 font-medium text-foreground first:mt-0";
            const children = renderInline(node.content, key);
            if (level === 2)
                return (
                    <h2 key={key} className={`text-2xl ${className}`}>
                        {children}
                    </h2>
                );
            if (level === 3)
                return (
                    <h3 key={key} className={`text-xl ${className}`}>
                        {children}
                    </h3>
                );
            return (
                <h4 key={key} className={`text-lg ${className}`}>
                    {children}
                </h4>
            );
        }
        case "bulletList":
            return (
                <ul
                    key={key}
                    className="mb-5 list-disc space-y-2 pl-5 text-foreground-secondary"
                >
                    {renderChildren(node.content, key)}
                </ul>
            );
        case "orderedList":
            return (
                <ol
                    key={key}
                    className="mb-5 list-decimal space-y-2 pl-5 text-foreground-secondary"
                >
                    {renderChildren(node.content, key)}
                </ol>
            );
        case "listItem":
            return <li key={key}>{renderChildren(node.content, key)}</li>;
        case "blockquote":
            return (
                <blockquote
                    key={key}
                    className="my-6 border-l-2 border-border-strong pl-4 text-foreground-secondary italic"
                >
                    {renderChildren(node.content, key)}
                </blockquote>
            );
        case "codeBlock":
            return (
                <pre
                    key={key}
                    className="mb-5 overflow-x-auto rounded-sm border border-border bg-surface p-4 font-mono text-sm text-foreground"
                >
                    <code>
                        {(node.content ?? []).map((c) => c.text ?? "").join("")}
                    </code>
                </pre>
            );
        case "image":
            return (
                <figure key={key} className="my-8">
                    <Image
                        src={String(node.attrs?.src ?? "")}
                        alt={String(node.attrs?.alt ?? "")}
                        width={1600}
                        height={900}
                        sizes="(min-width: 768px) 700px, 100vw"
                        className="h-auto w-full rounded-sm border border-border"
                    />
                    {node.attrs?.title ? (
                        <figcaption className="mt-2 font-mono text-xs text-foreground-secondary">
                            {String(node.attrs.title)}
                        </figcaption>
                    ) : null}
                </figure>
            );
        case "horizontalRule":
            return <hr key={key} className="my-10 border-border" />;
        case "table":
            return (
                <div key={key} className="mb-5 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <tbody>{renderChildren(node.content, key)}</tbody>
                    </table>
                </div>
            );
        case "tableRow":
            return (
                <tr key={key} className="border-b border-border">
                    {renderChildren(node.content, key)}
                </tr>
            );
        case "tableCell":
        case "tableHeader":
            return (
                <td
                    key={key}
                    className="p-2 align-top text-foreground-secondary"
                >
                    {renderChildren(node.content, key)}
                </td>
            );
        default:
            return null;
    }
}

export function ArticleContent({
    content,
    className,
}: {
    content: unknown;
    className?: string;
}) {
    const doc = content as TiptapNode | null | undefined;
    if (!doc?.content?.length) return null;

    return (
        <div className={cn("wrap-break-words", className)}>
            {doc.content.map((node, i) => renderNode(node, String(i)))}
        </div>
    );
}
