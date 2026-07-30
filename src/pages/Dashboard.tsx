import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

type Meeting = { id: string; title: string; starts_at: string; location: string | null }
type Resource = { id: string; title: string; type: string; url: string | null; category: string | null }
type Submission = {
  id: string
  project_name: string
  description: string | null
  github_link: string | null
  screenshot_url: string | null
  week: string | null
  created_at: string
}

export default function Dashboard() {
  const { session } = useAuth()
  const [memberId, setMemberId] = useState<string | null>(null)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const [uploading, setUploading] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!session) return
    supabase
      .from('members')
      .select('id')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => setMemberId(data?.id ?? null))
  }, [session])

  function refreshSubmissions() {
    if (!memberId) return
    supabase
      .from('submissions')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setSubmissions(data ?? []))
  }

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

  useEffect(refreshSubmissions, [memberId])

  async function handleScreenshot(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session) return
    setUploading(true)
    setSubmitError(null)
    const ext = file.name.split('.').pop()
    const path = `${session.user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('submissions').upload(path, file)
    if (error) {
      setSubmitError(error.message)
      setUploading(false)
      return
    }
    const { data } = supabase.storage.from('submissions').getPublicUrl(path)
    setScreenshotUrl(data.publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!memberId) return
    setSubmitError(null)
    const form = new FormData(e.currentTarget)

    const { error } = await supabase.from('submissions').insert({
      member_id: memberId,
      project_name: form.get('project_name'),
      description: form.get('description'),
      github_link: (form.get('github_link') as string) || null,
      screenshot_url: screenshotUrl,
      week: form.get('week'),
    })

    if (error) {
      setSubmitError(error.message)
      return
    }
    setSubmitted(true)
    setScreenshotUrl(null)
    ;(e.target as HTMLFormElement).reset()
    refreshSubmissions()
  }

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

      <section>
        <p className="text-brand-green font-mono text-xs tracking-widest uppercase mb-2">// keep shipping</p>
        <h2 className="font-display text-2xl text-navy mb-5">Submit Weekly Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 rounded-xl p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <input name="project_name" placeholder="Project name" required
              className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
            <input name="week" placeholder="Week (e.g. Week 1)" required
              className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
          </div>
          <textarea name="description" placeholder="What did you build?" rows={3} required
            className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
          <input name="github_link" type="url" placeholder="GitHub link (optional)"
            className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />

          <div>
            <label className="text-sm text-brand-orange font-medium cursor-pointer">
              {uploading ? 'Uploading…' : screenshotUrl ? 'Screenshot attached ✓' : 'Attach screenshot (optional)'}
              <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" disabled={uploading} />
            </label>
          </div>

          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}
          {submitted && <p className="text-brand-green text-sm">Submitted.</p>}

          <button type="submit" disabled={uploading}
            className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors disabled:opacity-50">
            submit_project()
          </button>
        </form>

        {submissions.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wide">Your submissions</p>
            {submissions.map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-lg p-4 flex gap-3">
                {s.screenshot_url && (
                  <img src={s.screenshot_url} className="h-14 w-14 rounded object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-navy text-sm">{s.project_name}</p>
                    {s.week && <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">{s.week}</span>}
                  </div>
                  {s.description && <p className="text-sm text-slate-500 mt-1">{s.description}</p>}
                  {s.github_link && (
                    <a href={s.github_link} target="_blank" rel="noreferrer" className="text-xs text-brand-green font-medium mt-1 inline-block">
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
