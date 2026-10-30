export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Loading indicator */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-200" />

          <div className="absolute h-8 w-8 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
        </div>

        <p className="text-sm text-zinc-400 tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}