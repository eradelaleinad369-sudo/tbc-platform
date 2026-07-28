import { useEffect, useRef, useState, ReactNode } from 'react'

// Fades + slides content up the first time it scrolls into view.
// Pure IntersectionObserver — no dependencies.
export default function RevealOnScroll({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={visible ? 'animate-fade-up' : 'opacity-0'}
    >
      {children}
    </div>
  )
}
