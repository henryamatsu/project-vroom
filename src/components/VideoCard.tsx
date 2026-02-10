type VideoCardProps = {
  name: string;
  isMuted: boolean;
  isSpeaking?: boolean;
};

export default function VideoCard({
  name,
  isMuted,
  isSpeaking = false,
}: VideoCardProps) {
  return (
    <div
      className={`relative flex aspect-video w-full items-center justify-center bg-neutral-900 text-white inset-ring ${
        isSpeaking ? `inset-ring-lime-300` : "inset-ring-slate-300"
      }`}
    >
      {/* Video placeholder */}
      <div className="flex flex-col items-center justify-center opacity-80">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-700 text-xl font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-neutral-300">No video</span>
      </div>

      {/* Name + mute badge */}
      <div className="absolute bottom-2 left-2">
        <div className="flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
          <span className="max-w-[120px] truncate text-sm font-medium">
            {name}
          </span>

          {isMuted && (
            <span className="text-red-400" title="Muted">
              🔇
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
