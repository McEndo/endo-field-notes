import brandLogo from '../../public/endo-logo2.png'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  // Match portfolio inheritance without changing the rest of Field Notes.
  const typography = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSynthesis: 'auto',
    textRendering: 'auto' as const,
    color: '#f5f5f5',
  }

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

      if (currentScrollY <= 10) {
        setVisible(true)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setVisible(false)
        setMenuOpen(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      {/* Navigation */}

      <header style={typography} className="fixed left-0 top-0 z-50 w-full">
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-8 py-7 transition-transform duration-300 ${
            visible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Logo */}

          <a
            href="https://endo-portfolio-test.netlify.app/"
            onClick={closeMenu}
            className="relative z-50 inline-flex items-center gap-2 text-xl font-semibold tracking-[-0.03em]"
          >
            <img src={brandLogo} alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7 shrink-0 object-contain" />
            <span>ENDO<span className="text-sky-400">.</span></span>
          </a>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-10 text-[10px] tracking-[0.2em] text-white/50 md:flex">
            <Link
              to="/"
              className="transition hover:text-white"
            >
              HOME
            </Link>

            <Link
              to="/writeups"
              className="transition hover:text-white"
            >
              WRITEUPS
            </Link>

            <Link
              to="/notes"
              className="transition hover:text-white"
            >
              NOTES
            </Link>

            <Link
              to="/#about"
              className="transition hover:text-white"
            >
              ABOUT
            </Link>

          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="font-mono text-[10px] tracking-[0.2em] text-white/50 transition hover:text-white md:hidden"
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}

      <div
        className={`fixed inset-0 z-40 bg-[#050505] transition-opacity duration-300 md:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-center px-8">

          <div className="flex flex-col gap-8">

            <Link
              to="/"
              onClick={closeMenu}
              className="text-4xl font-medium tracking-[-0.04em] text-white transition"
            >
              HOME
            </Link>

            <Link
              to="/writeups"
              onClick={closeMenu}
              className="text-4xl font-medium tracking-[-0.04em] text-white transition"
            >
              WRITEUPS
            </Link>

            <Link
              to="/notes"
              onClick={closeMenu}
              className="text-4xl font-medium tracking-[-0.04em] text-white transition"
            >
              NOTES
            </Link>

            <Link
              to="/#about"
              onClick={closeMenu}
              className="text-4xl font-medium tracking-[-0.04em] text-white transition"
            >
              ABOUT
            </Link>

          </div>

          <div className="absolute bottom-10 left-8">
            <p className="font-mono text-[9px] tracking-[0.2em] text-white/20">
              ENDO. / FIELD NOTES
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

export default Navbar
