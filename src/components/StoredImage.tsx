import { useEffect, useState } from "react";
import { QuestionImage } from "../types";
import { getImageUrl } from "../utils/imageStorage";
import { imageUploadService } from "../services/imageUploadService";

export function StoredImage({ image }: { image: QuestionImage }) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let alive = true;
    if (image.src.startsWith("indexeddb://")) {
      getImageUrl(image.src).then((value) => alive && setUrl(value));
    } else if (!image.src.startsWith("http") && !image.src.startsWith("blob:") && !image.src.startsWith("data:")) {
      imageUploadService.createSignedUrl(image.src).then((value) => alive && setUrl(value)).catch(() => alive && setUrl(undefined));
    } else {
      setUrl(image.src);
    }
    return () => {
      alive = false;
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
  }, [image.src]);

  if (!url) return <div className="mt-3 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700">Imagem salva no IndexedDB, mas não foi possível carregar a prévia neste momento.</div>;

  return (
    <figure className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
      <img src={url} alt={image.alt || "Imagem da questão"} className="max-h-80 w-full object-contain" />
      {image.caption && <figcaption className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{image.caption}</figcaption>}
    </figure>
  );
}
