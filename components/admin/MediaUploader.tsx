"use client";

import { useRef, useState } from "react";
import { X, Upload, GripVertical, Loader2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadImage } from "@/lib/utils/cloudinary-client";
import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";
import { cn } from "@/lib/utils/cn";

interface MediaUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  /** Cover image (single) vs article gallery (multiple, reorderable). */
  multiple?: boolean;
  max?: number;
  label: string;
}

export function MediaUploader({ images, onChange, multiple = false, max = 30, label }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const selected = multiple ? Array.from(files).slice(0, Math.max(0, max - images.length)) : [files[0]];
      const uploaded = await Promise.all(selected.map((f) => uploadImage(f)));
      onChange(multiple ? [...images, ...uploaded] : uploaded);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(images.filter((i) => i !== url));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.indexOf(String(active.id));
    const newIndex = images.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(images, oldIndex, newIndex));
  }

  const canAddMore = multiple ? images.length < max : images.length === 0;

  return (
    <div className="space-y-3">
      <TechnicalLabel>{label}</TechnicalLabel>

      {images.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((url) => (
                <SortableThumb key={url} url={url} draggable={multiple} onRemove={() => remove(url)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {canAddMore && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border text-sm text-foreground-muted transition-colors duration-base hover:border-border-strong hover:text-foreground-secondary disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : multiple ? "Add images" : "Upload image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p role="alert" className="text-xs text-foreground-secondary">
          {error}
        </p>
      )}
    </div>
  );
}

function SortableThumb({ url, draggable, onRemove }: { url: string; draggable: boolean; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-video overflow-hidden rounded-sm border border-border bg-surface",
        isDragging && "z-10 opacity-80",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      {draggable && (
        <button
          type="button"
          aria-label="Reorder"
          {...attributes}
          {...listeners}
          className="absolute left-1 top-1 rounded-xs bg-background/70 p-1 text-foreground-secondary opacity-0 transition-opacity duration-base group-hover:opacity-100"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1 top-1 rounded-xs bg-background/70 p-1 text-foreground-secondary opacity-0 transition-opacity duration-base hover:text-foreground group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
