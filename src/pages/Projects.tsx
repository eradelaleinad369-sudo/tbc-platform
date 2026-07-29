import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RevealOnScroll from '../components/RevealOnScroll'

type Project = {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
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
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((p, i) => (
          <RevealOnScroll key={p.id} delay={i * 60}>
            <Link to={`/projects/${p.id}`} className="lift-card block border border-slate-200 rounded-xl overflow-hidden h-full">
              {p.cover_image_url && (
                <img src={p.cover_image_url} alt={p.title} className="w-full aspect-[16/9] object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-navy">{p.title}</p>
                  {p.is_demo_day && (
                    <span className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">Demo Day</span>
                  )}
                </div>
                {p.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>}
              </div>
            </Link>
          </RevealOnScroll>
        ))}
        {!loading && projects.length === 0 && (
          <p className="text-slate-400 text-sm">No projects yet — add some in Supabase's Table Editor.</p>
        )}
      </div>
    </div>
  )
}
