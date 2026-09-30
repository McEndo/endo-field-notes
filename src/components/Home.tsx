import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ContentList from './ContentList'
import { entries } from '../lib/notes'

const Home = () => (
  <main>
    <section className="relative flex min-h-[78vh] items-center overflow-hidden border-b border-white/10 bg-[#050505]">
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} className="absolute -right-[260px] top-16 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-white/10 via-white/[0.03] to-transparent sm:-right-40 sm:top-20 sm:h-[650px] sm:w-[650px]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pt-24 pb-20 sm:pt-28">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15 }} className="mb-5 font-mono text-[9px] tracking-[0.35em] text-sky-400 sm:text-[10px]">TECHNICAL DOCUMENTATION</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .2 }} className="max-w-5xl text-[clamp(4rem,13vw,9rem)] font-medium leading-[.82] tracking-[-.07em]">FIELD<br className="sm:hidden" /> NOTES</motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .45 }} className="mt-8 max-w-xl text-sm leading-7 text-white/45 sm:text-base">A record of hands-on labs, security concepts, projects, technical experiments, and things learned along the way.</motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .55 }} className="mt-10 flex items-center gap-8">
          <Link to="/#recent" className="border border-white/30 px-6 py-3.5 text-[9px] tracking-[.2em] text-white/70 transition hover:border-white hover:bg-white hover:text-black sm:px-7 sm:py-4 sm:text-[10px]">BROWSE CONTENT <span className="ml-5">→</span></Link>
          <a href="https://endo-portfolio-test.netlify.app/" className="border-b border-sky-400 pb-2 text-[9px] tracking-[.2em] text-white/60 transition hover:text-white sm:text-[10px]">MAIN PORTFOLIO</a>
        </motion.div>
      </div>
    </section>

    <section id="recent" className="border-b border-white/10 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-8 py-20 sm:py-28 md:py-32">
        <Reveal>
          <div className="mb-14 flex items-start gap-5 sm:mb-16 sm:gap-6">
            <span className="font-mono text-sm text-sky-400">01</span>
            <div><p className="text-[10px] tracking-[.3em] text-white/40 sm:text-xs">LATEST FROM THE ARCHIVE</p><h2 className="mt-4 text-4xl font-medium leading-none tracking-[-.03em] sm:text-5xl md:text-6xl">RECENT CONTENT</h2></div>
          </div>
        </Reveal>
        <Reveal delay={.08}>
          <div>
            <ContentList
              entries={entries}
              emptyLabel="NO PUBLISHED CONTENT YET"
              emptyDescription="This archive will grow from real labs, projects, research, and experiments. Nothing is presented as completed until it has actually been done and documented."
            />
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-mono text-[9px] tracking-[.2em]">
              <Link to="/writeups" className="border-b border-white/20 pb-2 text-white/45 transition hover:border-sky-400 hover:text-white">ALL WRITEUPS →</Link>
              <Link to="/notes" className="border-b border-white/20 pb-2 text-white/45 transition hover:border-sky-400 hover:text-white">ALL NOTES →</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <section id="about" className="bg-[#050505]">
      <div className="mx-auto max-w-7xl px-8 py-20 sm:py-28 md:py-32">
        <Reveal>
          <div className="flex items-start gap-5 sm:gap-6"><span className="font-mono text-sm text-sky-400">02</span><div><p className="text-[10px] tracking-[.3em] text-white/40 sm:text-xs">ABOUT THE ARCHIVE</p><h2 className="mt-4 text-4xl font-medium leading-none tracking-[-.03em] sm:text-5xl md:text-6xl">WHY FIELD NOTES</h2></div></div>
          <div className="mt-12 max-w-2xl border-t border-white/10 pt-8 text-sm leading-8 text-white/45 sm:mt-16 sm:text-base">Field Notes is where practical work gets documented. The focus is on what was tested, what was learned, how something was approached, and what should be remembered — not on making a collection of impressive-sounding claims.</div>
        </Reveal>
      </div>
    </section>
  </main>
)

export default Home
