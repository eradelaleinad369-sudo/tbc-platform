import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import RevealOnScroll from '../components/RevealOnScroll'

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
        <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// actually building</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy">Project Showcase</h1>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <RevealOnScroll key={p.id} delay={i * 60}>
            <div className="lift-card border border-slate-200 rounded-xl p-5 h-full">
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
          </RevealOnScroll>
        ))}
        {!loading && projects.length === 0 && (
          <p className="text-slate-400 text-sm">No projects yet — add some in Supabase's Table Editor.</p>
        )}
      </div>
    </div>
  )
}
