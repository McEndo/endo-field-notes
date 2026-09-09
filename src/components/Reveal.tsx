import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = { children: ReactNode; delay?: number }

const Reveal = ({ children, delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export default Reveal
