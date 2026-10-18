"use client";

import { useEffect, useRef, useState } from "react";

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX = 4 * 1024 * 1024; // o mesmo limite do servidor (app/admin/actions.ts)

// Prints e fotos coladas costumam vir em PNG enorme: reduz e regrava em WebP antes de mandar.
async function fit(file: File): Promise<File> {
  if (file.size <= MAX) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/webp", 0.88));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
}

/**
 * Campo de imagem: cola (Ctrl/Cmd+V em qualquer lugar da página), arrasta ou clica para escolher.
 * Mostra a prévia antes de salvar. Envia como um <input type=file> comum, então o servidor não muda.
 */
export function ImageInput({
  name,
  removeName,
  current,
  shape,
}: {
  name: string;
  removeName: string;
  current?: string;
  shape: "round" | "wide";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(current);
  const [removed, setRemoved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>();

  async function take(file?: File | null) {
    if (!file) return;
    if (!TYPES.includes(file.type)) return setError("Use JPG, PNG ou WebP.");
    const fitted = await fit(file);
    if (fitted.size > MAX) return setError("A imagem passa de 4 MB mesmo reduzida.");
    const list = new DataTransfer();
    list.items.add(fitted);
    fileRef.current!.files = list.files;
    setError(undefined);
    setRemoved(false);
    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return URL.createObjectURL(fitted);
    });
  }

  // Colar em qualquer lugar da página, menos quando o que se cola é texto num campo.
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const file = [...(event.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
      if (!file) return;
      event.preventDefault();
      take(file);
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  });

  function clear() {
    fileRef.current!.value = "";
    setPreview(undefined);
    setRemoved(Boolean(current));
  }

  const frame = shape === "round" ? "size-28 rounded-full" : "aspect-[16/10] w-56 rounded-xl";

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileRef.current?.click()}
        onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && fileRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          take(event.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-wrap items-center gap-6 rounded-2xl border border-dashed p-5 outline-none transition-colors focus-visible:border-accent-ink ${
          dragging ? "border-accent bg-accent/10" : "border-border hover:border-muted"
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:), sem otimizar
          <img src={preview} alt="Prévia" className={`${frame} shrink-0 object-cover`} />
        ) : (
          <span aria-hidden className={`${frame} shrink-0 bg-surface`} />
        )}
        <span className="text-[15px]">
          <span className="block font-semibold">
            Cole (<kbd className="font-mono">⌘V</kbd> ou <kbd className="font-mono">Ctrl+V</kbd>), arraste ou clique
          </span>
          <span className="mt-1 block text-sm text-muted">
            JPG, PNG ou WebP. {shape === "round" ? "Rosto no centro; aparece recortada em círculo." : "Aparece em 16:10."}
          </span>
        </span>
      </div>

      <input
        ref={fileRef}
        name={name}
        type="file"
        accept={TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => take(event.target.files?.[0])}
      />
      {removed && <input type="hidden" name={removeName} value="on" />}

      <div className="mt-2 flex items-center gap-4 text-sm">
        {preview && (
          <button type="button" onClick={clear} className="font-mono text-muted underline underline-offset-4 hover:text-ink">
            tirar imagem
          </button>
        )}
        {removed && !preview && (
          <button
            type="button"
            onClick={() => {
              setRemoved(false);
              setPreview(current);
            }}
            className="font-mono text-muted underline underline-offset-4 hover:text-ink"
          >
            desfazer
          </button>
        )}
        {error && <span role="alert" className="text-red-600 dark:text-red-400">{error}</span>}
      </div>
    </div>
  );
}
