import { motion } from 'motion/react'

export default function GlowBar() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        zIndex: 100,
        overflow: 'hidden',
        background: 'rgba(30,45,69,0.6)',
      }}
    >
      {/* Static base line */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.3) 50%, transparent 100%)',
        }}
      />

      {/* Animated scanner */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          width: '30%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.9) 50%, rgba(147,197,253,1) 60%, rgba(59,130,246,0.9) 70%, transparent 100%)',
          boxShadow: '0 0 12px 3px rgba(59,130,246,0.6)',
        }}
        initial={{ left: '-30%' }}
        animate={{ left: '130%' }}
        transition={{
          duration: 3.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
    </div>
  )
}
