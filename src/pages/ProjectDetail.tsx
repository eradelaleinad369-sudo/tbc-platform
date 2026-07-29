import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

type Project = {
  id: string
  title: string
  description: string | null
  link: string | null
  is_demo_day: boolean
  cover_image_url: string | null
  created_at: string
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true)
        else setProject(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="text-slate-400">Loading…</p>
  if (notFound || !project) {
    return (
      <div>
        <p className="text-slate-500">Project not found.</p>
        <Link to="/projects" className="text-brand-orange text-sm font-medium mt-2 inline-block">← Back to Projects</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/projects" className="text-sm text-slate-400 hover:text-brand-orange transition-colors">← Back to Projects</Link>

      {project.cover_image_url && (
        <img src={project.cover_image_url} alt={project.title} className="w-full aspect-[16/9] object-cover rounded-xl mt-4" />
      )}

      <div className="flex items-center gap-3 mt-6">
        <h1 className="font-display text-3xl text-navy">{project.title}</h1>
        {project.is_demo_day && (
          <span className="text-xs bg-brand-orange text-white px-2 py-0.5 rounded-full font-medium">Demo Day</span>
        )}
      </div>
      <p className="text-xs text-slate-400 font-mono mt-1">
        {new Date(project.created_at).toLocaleDateString()}
      </p>

      {project.description && (
        <p className="text-slate-600 leading-relaxed mt-6 whitespace-pre-line">{project.description}</p>
      )}

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-6 bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors"
        >
          view_project() →
        </a>
      )}
    </div>
  )
}
