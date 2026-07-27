import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

type Meeting = { id: string; title: string; starts_at: string; location: string | null }
type Resource = { id: string; title: string; type: string; url: string | null; category: string | null }

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    Promise.all([
      supabase.from('meetings').select('*').order('starts_at', { ascending: true }),
      supabase.from('resources').select('*').order('created_at', { ascending: false }),
    ]).then(([m, r]) => {
      setMeetings(m.data ?? [])
      setResources(r.data ?? [])
      setLoading(false)
    })
  }, [session])

  if (!session) {
    return (
      <div className="max-w-sm">
        <p className="text-slate-500">
          Please <a href="/login" className="text-brand-orange font-medium">log in</a> to view the member dashboard.
        </p>
      </div>
    )
  }
  if (loading) return <p className="text-slate-400">Loading…</p>

  return (
    <div className="space-y-12">
      <section>
        <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">Members only</p>
        <h1 className="font-display text-2xl text-navy mb-5">Upcoming Meetings</h1>
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-navy">{m.title}</p>
              <p className="text-sm text-slate-500">{new Date(m.starts_at).toLocaleString()}</p>
              {m.location && <p className="text-sm text-slate-500">{m.location}</p>}
            </div>
          ))}
          {meetings.length === 0 && <p className="text-slate-400 text-sm">No meetings scheduled.</p>}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-navy mb-5">Resources</h2>
        <div className="space-y-3">
          {resources.map((r) => (
            <div key={r.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-navy">{r.title}</p>
                {r.category && <p className="text-xs text-slate-400">{r.category}</p>}
              </div>
              {r.url && (
                <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-brand-green font-medium">Open →</a>
              )}
            </div>
          ))}
          {resources.length === 0 && <p className="text-slate-400 text-sm">No resources yet.</p>}
        </div>
      </section>
    </div>
  )
}
