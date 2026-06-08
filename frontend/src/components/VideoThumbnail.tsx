import { useEffect, useRef, useState } from "react";

export default function VideoThumbnail({
  src,
  className = "absolute inset-0",
}: {
  src: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    const capture = () => {
      const video = document.createElement("video");
      video.muted      = true;
      video.playsInline = true;

      video.addEventListener("canplay", () => {
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 360;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        setReady(true);
        video.src = ""; // libera recursos após capturar o frame
      }, { once: true });

      video.src = src;
    };

    // Só carrega quando o card entrar na viewport
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          capture();
        }
      },
      { rootMargin: "300px" }
    );

    obs.observe(container);

    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, [src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
