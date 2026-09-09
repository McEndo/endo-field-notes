import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY <= 10 || currentScrollY < lastScrollY) setVisible(true)
      else if (currentScrollY > lastScrollY) {
        setVisible(false)
        setMenuOpen(false)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-8 py-7 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link to="/" onClick={() => setMenuOpen(false)} className="relative z-50 text-xl font-semibold tracking-[-0.03em]">
          ENDO<span className="text-sky-400">.</span>
        </Link>

        <div className="hidden items-center gap-10 text-[10px] tracking-[0.2em] text-white/50 md:flex">
          <Link to="/" className="transition-colors duration-300 hover:text-white">HOME</Link>
          <Link to="/#notes" className="transition-colors duration-300 hover:text-white">NOTES</Link>
          <Link to="/#about" className="transition-colors duration-300 hover:text-white">ABOUT</Link>
          <a href="https://endo-portfolio-test.netlify.app/" className="transition-colors duration-300 hover:text-white">PORTFOLIO</a>
        </div>

        <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)} className="relative z-50 font-mono text-[10px] tracking-[0.2em] text-white/50 transition hover:text-white md:hidden">
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </nav>

      <div id="mobile-navigation" inert={!menuOpen} aria-hidden={!menuOpen} className={`fixed inset-0 z-40 bg-[#050505] transition-opacity duration-300 md:hidden ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}>
        <div className="flex h-full flex-col justify-center px-8">
          <div className="flex flex-col gap-8">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-4xl font-medium tracking-[-0.04em]">HOME</Link>
            <Link to="/#notes" onClick={() => setMenuOpen(false)} className="text-4xl font-medium tracking-[-0.04em]">NOTES</Link>
            <Link to="/#about" onClick={() => setMenuOpen(false)} className="text-4xl font-medium tracking-[-0.04em]">ABOUT</Link>
            <a href="https://endo-portfolio-test.netlify.app/" onClick={() => setMenuOpen(false)} className="text-4xl font-medium tracking-[-0.04em]">PORTFOLIO</a>
          </div>
          <p className="absolute bottom-10 left-8 font-mono text-[9px] tracking-[0.2em] text-white/20">ENDO. / FIELD NOTES</p>
        </div>
      </div>
    </header>
  )
}

export default Navbar
