export default function TestimonySection() {
  return (
    <div className="relative flex flex-col w-full justify-center items-center bg-grid overflow-hidden z-20">
      <div className="relative z-10 h-[28rem] w-full flex flex-col justify-center items-center gap-6">
        <div className="flex flex-col justify-center items-start p-10 bg-midnight-300 border border-neutral-800 rounded-3xl gap-4 max-w-[60rem] text-center">
          <h3 className="w-full text-3xl font-semibold text-neutral-200 text-start">
            “This is what I imagined AI would do for developers—extensive
            discovery over existing files and helping developers understand a
            huge codebase...”
          </h3>

          <span className="text-neutral-400 text-sm self-end">
            — <em>Kaushik Katikala, Software Engineer</em>
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700" />
    </div>
  );
}
