"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ArticleGalleryProps {
    images: string[];
    alt: string;
}

/**
 * §21: 0 images -> nothing, 1 -> a large editorial image, >1 -> a
 * responsive gallery (asymmetric grid desktop / stacked mobile) with a
 * lightbox (next/prev, keyboard, touch, lazy loading, alt text).
 */
export function ArticleGallery({ images, alt }: ArticleGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (images.length === 0) return null;

    if (images.length === 1) {
        return (
            <figure className="my-10">
                <Image
                    src={images[0]}
                    alt={alt}
                    width={1600}
                    height={900}
                    sizes="(min-width: 768px) 700px, 100vw"
                    className="h-auto w-full cursor-zoom-in rounded-sm border border-border"
                    onClick={() => setLightboxIndex(0)}
                />
            </figure>
        );
    }

    return (
        <>
            {/*
        §21/§35: mobile is a clean vertical sequence (single column), not a
        shrunken version of the desktop grid — the asymmetric multi-column
        composition only kicks in from `sm:` up.
      */}
            <div className="my-10 grid grid-cols-1 gap-2 sm:grid-cols-6">
                {images.map((img, i) => (
                    <button
                        key={img}
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className={cn(
                            "group relative cursor-zoom-in overflow-hidden rounded-sm border border-border",
                            "aspect-4/3 sm:aspect-square",
                            i === 0
                                ? "sm:col-span-4 sm:row-span-2 sm:aspect-4/3"
                                : "sm:col-span-2",
                        )}
                    >
                        <Image
                            src={img}
                            alt={`${alt} — image ${i + 1} of ${images.length}`}
                            fill
                            sizes="(min-width: 640px) 33vw, 100vw"
                            className="object-cover transition-transform duration-slow group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>
            {lightboxIndex !== null && (
                <Lightbox
                    images={images}
                    alt={alt}
                    index={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    onIndexChange={setLightboxIndex}
                />
            )}
        </>
    );
}

function Lightbox({
    images,
    alt,
    index,
    onClose,
    onIndexChange,
}: {
    images: string[];
    alt: string;
    index: number;
    onClose: () => void;
    onIndexChange: (i: number) => void;
}) {
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight")
                onIndexChange((index + 1) % images.length);
            if (e.key === "ArrowLeft")
                onIndexChange((index - 1 + images.length) % images.length);
        }
        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [index, images.length, onClose, onIndexChange]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                if (delta > 50)
                    onIndexChange((index - 1 + images.length) % images.length);
                else if (delta < -50)
                    onIndexChange((index + 1) % images.length);
                touchStartX.current = null;
            }}
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-2 top-2 p-2.5 text-foreground-secondary transition-colors duration-base hover:text-foreground sm:right-4 sm:top-4"
            >
                <X className="h-6 w-6" />
            </button>
            <button
                type="button"
                onClick={() =>
                    onIndexChange((index - 1 + images.length) % images.length)
                }
                aria-label="Previous image"
                className="absolute left-1 p-2.5 text-foreground-secondary transition-colors duration-base hover:text-foreground sm:left-3"
            >
                <ChevronLeft className="h-8 w-8" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={images[index]}
                alt={`${alt} — image ${index + 1} of ${images.length}`}
                className="max-h-[85vh] max-w-full object-contain"
            />
            <button
                type="button"
                onClick={() => onIndexChange((index + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-1 p-2.5 text-foreground-secondary transition-colors duration-base hover:text-foreground sm:right-3"
            >
                <ChevronRight className="h-8 w-8" />
            </button>
            <div className="absolute bottom-4 font-mono text-xs text-foreground-secondary">
                {index + 1} / {images.length}
            </div>
        </div>
    );
}
