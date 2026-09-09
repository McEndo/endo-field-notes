const Footer = () => (
  <footer className="border-t border-white/10 bg-[#050505]">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-8 py-12 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-lg font-semibold tracking-[-0.03em]">ENDO<span className="text-sky-400">.</span></span>
      <div className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] tracking-[0.18em] text-white/30">
        <a href="https://github.com/McEndo" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">GITHUB</a>
        <a href="https://tryhackme.com/p/McEnd0" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">TRYHACKME</a>
        <a href="mailto:ehondormichael14@gmail.com" className="transition hover:text-white">CONTACT</a>
      </div>
      <p className="font-mono text-[9px] tracking-[0.1em] text-white/15">FIELD NOTES / 2026</p>
    </div>
  </footer>
)

export default Footer
