import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Button from "./Button";

export default function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const lastVolumeRef = useRef(1);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (v > 0) lastVolumeRef.current = v;
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(lastVolumeRef.current || 0.5);
    } else {
      lastVolumeRef.current = volume;
      setVolume(0);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = volume === 0;
  }, [volume]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10">
      <p className="mb-3 font-semibold text-white">{title}</p>
      <div className="flex items-center gap-4">
        <Button onClick={togglePlay}>{playing ? "Pausar" : "Tocar"}</Button>

        <div className="flex items-center gap-3">
          {/* Botão mute */}
          <button
            onClick={toggleMute}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
            title={volume === 0 ? "Ativar som" : "Silenciar"}
          >
            {volume === 0 ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 9v6H5l-4 4V5l4 4h4z"></path>
                <path d="M19 5l-6 6"></path>
                <path d="M13 11l6 6"></path>
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5L6 9H3v6h3l5 4z"></path>
                <path d="M15.54 8.46a5 5 0 010 7.07"></path>
                <path d="M18.07 5.93a9 9 0 010 12.73"></path>
              </svg>
            )}
          </button>

          {/* Slider funcional com glow */}
          <div className="relative w-32 h-2 flex items-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 appearance-none bg-white/10 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#ff2f2f] [&::-webkit-slider-thumb]:to-[#ff7a00] [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,90,90,0.6),0_0_12px_rgba(255,122,0,0.5)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              style={{
                background: `linear-gradient(90deg, #ff2f2f ${
                  volume * 100
                }%, rgba(255,255,255,0.1) ${volume * 100}%)`,
              }}
            />
          </div>
        </div>

        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onEnded={() => setPlaying(false)}
        />
      </div>
    </div>
  );
}
