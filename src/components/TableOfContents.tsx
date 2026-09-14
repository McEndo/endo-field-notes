import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export type TocEntry = { id: string; title: string; depth: 2 | 3 | 4 }

export default function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const desktop = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  const closePanel = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) trigger.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!open) return
    closeButton.current?.focus({ preventScroll: true })
    const outside = (event: PointerEvent) => {
      if (!desktop.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus({ preventScroll: true })
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  useEffect(() => {
    let frame = 0
    const headings = entries.map(entry => document.getElementById(entry.id)).filter((heading): heading is HTMLElement => heading !== null)
    const update = () => {
      frame = 0
      const offset = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 7 + 1
      let current = headings[0]?.id ?? ''
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > offset) break
        current = heading.id
      }
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    const article = document.querySelector('.note-content')
    if (article) observer.observe(article)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
    }
  }, [entries])

  if (!entries.length) return null

  const links = (desktopPanel = false) => (
    <nav aria-label="On this page">
      <ul className="space-y-2">
        {entries.map(entry => (
          <li key={entry.id} className={entry.depth === 4 ? 'pl-6' : entry.depth === 3 ? 'pl-3' : ''}>
            <Link
              to={`#${encodeURIComponent(entry.id)}`}
              onClick={desktopPanel ? () => closePanel(true) : undefined}
              aria-current={active === entry.id ? 'location' : undefined}
              className={`block border-l py-1 pl-3 text-xs leading-5 transition-colors hover:text-white ${active === entry.id ? 'border-sky-400 text-sky-400' : 'border-white/10 text-white/40'}`}
            >
              {entry.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      <details className="mt-8 border-y border-white/10 py-4 xl:hidden">
        <summary className="cursor-pointer font-mono text-[10px] tracking-[.15em] text-white/50">ON THIS PAGE</summary>
        <div className="mt-4 max-h-[50vh] overflow-y-auto">{links()}</div>
      </details>
      <aside className="fixed right-[clamp(1.5rem,1.5vw,2rem)] top-28 z-30 hidden w-12 xl:block">
        <div ref={desktop} className="relative" onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
        }}>
          <button
            ref={trigger}
            type="button"
            aria-label="Open On This Page navigation"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(value => !value)}
            className="flex max-h-[calc(100dvh-8rem)] w-12 flex-col items-start gap-3 overflow-y-auto rounded px-3 py-3 transition-colors hover:bg-white/[.03] focus-visible:outline focus-visible:outline-1 focus-visible:outline-sky-400"
          >
            {entries.map(entry => (
              <span key={entry.id} aria-hidden="true" data-active={active === entry.id} className={`block h-px shrink-0 transition-colors ${entry.depth === 2 ? 'w-6' : entry.depth === 3 ? 'w-4' : 'w-2'} ${active === entry.id ? 'bg-sky-400' : entry.depth === 2 ? 'bg-white/40' : 'bg-white/20'}`} />
            ))}
          </button>
          <div
            id={panelId}
            role="region"
            aria-label="On This Page panel"
            aria-hidden={!open}
            inert={!open}
            className={`absolute right-0 top-0 z-30 w-64 rounded-md border border-white/10 bg-[#0b0b0b] p-5 shadow-lg transition-opacity duration-150 motion-reduce:transition-none ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] tracking-[.15em] text-white/40">ON THIS PAGE</p>
              <button ref={closeButton} type="button" aria-label="Close On This Page navigation" onClick={() => closePanel(true)} className="px-2 py-1 text-sm text-white/40 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-sky-400">×</button>
            </div>
            <div className="max-h-[calc(100dvh-13rem)] overflow-y-auto">{links(true)}</div>
          </div>
        </div>
      </aside>
    </>
  )
}
