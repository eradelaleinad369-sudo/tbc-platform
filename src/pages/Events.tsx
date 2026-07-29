import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RevealOnScroll from '../components/RevealOnScroll'

type Event = {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  location: string | null
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })
      .then(({ data }) => {
        setEvents(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// what we've run</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy">Events</h1>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((e, i) => (
          <RevealOnScroll key={e.id} delay={i * 60}>
            <Link to={`/events/${e.id}`} className="lift-card block border border-slate-200 rounded-xl overflow-hidden h-full">
              {e.cover_image_url && (
                <img src={e.cover_image_url} alt={e.title} className="w-full aspect-[16/9] object-cover" />
              )}
              <div className="p-5">
                <p className="font-semibold text-navy">{e.title}</p>
                <div className="flex gap-3 text-xs text-slate-400 font-mono mt-1">
                  {e.event_date && <span>{new Date(e.event_date).toLocaleDateString()}</span>}
                  {e.location && <span>{e.location}</span>}
                </div>
                {e.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{e.description}</p>}
              </div>
            </Link>
          </RevealOnScroll>
        ))}
        {!loading && events.length === 0 && (
          <p className="text-slate-400 text-sm">No events yet — add some in Supabase's Table Editor.</p>
        )}
      </div>
    </div>
  )
}
