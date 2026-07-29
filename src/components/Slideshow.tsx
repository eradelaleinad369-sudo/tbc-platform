import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export type SlideItem = {
  id: string
  title: string
  image: string
  href: string
  tag: string
}

export default function Slideshow({ items, intervalMs = 5000 }: { items: SlideItem[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || items.length <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs)
    return () => clearInterval(t)
  }, [paused, items.length, intervalMs])

  if (items.length === 0) return null

  const current = items[index]

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link to={current.href} className="block relative aspect-[16/9] group">
        <img
          key={current.id}
          src={current.image}
          alt={current.title}
          className="w-full h-full object-cover animate-fade-up"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <p className="text-brand-orange font-mono text-xs tracking-widest uppercase mb-1">{current.tag}</p>
          <p className="text-white font-display text-lg sm:text-2xl leading-tight group-hover:text-brand-orange transition-colors">
            {current.title}
          </p>
        </div>
      </Link>

      {items.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-brand-orange' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
