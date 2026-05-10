/** Reserved layout width for future banners — no third‑party ads. */
export default function AdSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-3 py-8 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Banner placeholder
        </div>
        <div className="mt-2 text-xs text-zinc-500">Sidebar slot · ~288px</div>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-3 py-10 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Banner placeholder
        </div>
        <div className="mt-2 text-xs text-zinc-500">Medium rectangle</div>
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 px-3 py-6 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Banner placeholder
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4 text-left">
        <div className="text-xs font-semibold text-emerald-900">Tip</div>
        <p className="mt-1 text-xs text-emerald-800">
          Save your company profile once and documents will auto-fill across the
          workspace.
        </p>
      </div>
    </aside>
  );
}
