/** Reserved layout width for future banners — no third-party ads. */
export default function AdSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
      <div className="border border-dashed border-[#d9d9d9] bg-white px-3 py-8 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b0b0b0]">
          Banner placeholder
        </div>
        <div className="mt-2 text-xs text-[#888888]">Sidebar slot · ~288px</div>
      </div>

      <div className="border border-dashed border-[#d9d9d9] bg-white px-3 py-10 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b0b0b0]">
          Banner placeholder
        </div>
        <div className="mt-2 text-xs text-[#888888]">Medium rectangle</div>
      </div>

      <div className="border border-dashed border-[#d9d9d9] bg-white px-3 py-6 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b0b0b0]">
          Banner placeholder
        </div>
      </div>

      <div className="border-l-4 border-black bg-[#f6f6f6] p-4 text-left">
        <div className="text-xs font-bold text-black uppercase tracking-[0.1em]">Tip</div>
        <p className="mt-1.5 text-xs leading-relaxed text-[#666666]">
          Save your company profile once and documents will auto-fill across the
          workspace.
        </p>
      </div>
    </aside>
  );
}
