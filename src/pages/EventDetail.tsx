import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Event = {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  location: string | null
  link: string | null
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setEvent(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="text-slate-400">Loading…</p>
  if (notFound || !event) {
    return (
      <div>
        <p className="text-slate-500">Event not found.</p>
        <Link to="/events" className="text-brand-orange text-sm font-medium mt-2 inline-block">← Back to Events</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/events" className="text-sm text-slate-400 hover:text-brand-orange transition-colors">← Back to Events</Link>

      {event.cover_image_url && (
        <img src={event.cover_image_url} alt={event.title} className="w-full aspect-[16/9] object-cover rounded-xl mt-4" />
      )}

      <h1 className="font-display text-3xl text-navy mt-6">{event.title}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-2 font-mono">
        {event.event_date && <span>{new Date(event.event_date).toLocaleDateString()}</span>}
        {event.location && <span>{event.location}</span>}
      </div>

      {event.description && (
        <p className="text-slate-600 leading-relaxed mt-6 whitespace-pre-line">{event.description}</p>
      )}

      {event.link && (
        <a
          href={event.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors"
        >
          learn_more() →
        </a>
      )}
    </div>
  )
}
