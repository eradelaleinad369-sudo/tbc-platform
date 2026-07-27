import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Project = {
  id: string
  title: string
  description: string | null
  link: string | null
  is_demo_day: boolean
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">Actually building</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy">Project Showcase</h1>
      </div>

      {loading && <p className="text-slate-400">Loading projects…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="border border-slate-200 rounded-xl p-5 hover:border-brand-orange/50 transition-colors">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-navy">{p.title}</p>
              {p.is_demo_day && (
                <span className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded-full font-medium">Demo Day</span>
              )}
            </div>
            {p.description && <p className="text-sm text-slate-500 mt-2">{p.description}</p>}
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer" className="text-sm text-brand-green font-medium mt-3 inline-block">
                View project →
              </a>
            )}
          </div>
        ))}
        {!loading && projects.length === 0 && (
          <p className="text-slate-400 text-sm">No projects yet — add some in Supabase's Table Editor.</p>
        )}
      </div>
    </div>
  )
}
