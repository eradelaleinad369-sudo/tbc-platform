import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Project = {
  id: string
  title: string
  description: string | null
  link: string | null
  is_demo_day: boolean
  cover_image_url: string | null
}

type Event = {
  id: string
  title: string
  description: string | null
  cover_image_url: string | null
  event_date: string | null
  location: string | null
  link: string | null
}

async function uploadCoverImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from('media').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export default function Admin() {
  const [tab, setTab] = useState<'projects' | 'events'>('projects')

  return (
    <div>
      <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// admin</p>
      <h1 className="font-display text-3xl text-navy mb-6">Content Manager</h1>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab('projects')}
          className={`font-mono text-xs px-4 py-2 rounded ${tab === 'projects' ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'}`}
        >
          projects
        </button>
        <button
          onClick={() => setTab('events')}
          className={`font-mono text-xs px-4 py-2 rounded ${tab === 'events' ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500'}`}
        >
          events
        </button>
      </div>

      {tab === 'projects' ? <ProjectsPanel /> : <EventsPanel />}
    </div>
  )
}

function ProjectsPanel() {
  const [items, setItems] = useState<Project[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const editing = items.find((i) => i.id === editingId) ?? null

  function refresh() {
    supabase.from('projects').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setItems(data ?? [])
    })
  }

  useEffect(refresh, [])

  async function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      setCoverUrl(await uploadCoverImage(file))
    } catch (err: any) {
      setError(err.message)
    }
    setUploading(false)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get('title') as string,
      description: form.get('description') as string,
      link: (form.get('link') as string) || null,
      is_demo_day: form.get('is_demo_day') === 'on',
      cover_image_url: coverUrl ?? editing?.cover_image_url ?? null,
    }

    const { error } = editingId
      ? await supabase.from('projects').update(payload).eq('id', editingId)
      : await supabase.from('projects').insert(payload)

    if (error) {
      setError(error.message)
      return
    }
    setEditingId(null)
    setCoverUrl(null)
    ;(e.target as HTMLFormElement).reset()
    refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    refresh()
  }

  function startEdit(item: Project) {
    setEditingId(item.id)
    setCoverUrl(item.cover_image_url)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 rounded-xl p-5 mb-8">
        <p className="font-mono text-xs text-slate-400">{editingId ? `editing: ${editing?.title}` : 'new_project()'}</p>
        <input name="title" placeholder="Title" defaultValue={editing?.title ?? ''} required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <textarea name="description" placeholder="Description" defaultValue={editing?.description ?? ''} rows={3}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <input name="link" type="url" placeholder="External link (optional)" defaultValue={editing?.link ?? ''}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="is_demo_day" defaultChecked={editing?.is_demo_day ?? false} />
          Demo Day project
        </label>
        <div>
          <label className="text-sm text-brand-orange font-medium cursor-pointer">
            {uploading ? 'Uploading…' : coverUrl ? 'Cover image selected ✓' : 'Upload cover image'}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
          </label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors">
            {editingId ? 'save_changes()' : 'add_project()'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setCoverUrl(null) }} className="text-sm text-slate-500 px-4">
              cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-3 min-w-0">
              {item.cover_image_url && <img src={item.cover_image_url} className="h-10 w-10 rounded object-cover shrink-0" />}
              <p className="text-sm font-medium text-navy truncate">{item.title}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => startEdit(item)} className="text-xs text-brand-orange font-medium">edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 font-medium">delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsPanel() {
  const [items, setItems] = useState<Event[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  const editing = items.find((i) => i.id === editingId) ?? null

  function refresh() {
    supabase.from('events').select('*').order('event_date', { ascending: false }).then(({ data }) => {
      setItems(data ?? [])
    })
  }

  useEffect(refresh, [])

  async function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      setCoverUrl(await uploadCoverImage(file))
    } catch (err: any) {
      setError(err.message)
    }
    setUploading(false)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const eventDate = form.get('event_date') as string
    const payload = {
      title: form.get('title') as string,
      description: form.get('description') as string,
      location: (form.get('location') as string) || null,
      link: (form.get('link') as string) || null,
      event_date: eventDate ? new Date(eventDate).toISOString() : null,
      cover_image_url: coverUrl ?? editing?.cover_image_url ?? null,
    }

    const { error } = editingId
      ? await supabase.from('events').update(payload).eq('id', editingId)
      : await supabase.from('events').insert(payload)

    if (error) {
      setError(error.message)
      return
    }
    setEditingId(null)
    setCoverUrl(null)
    ;(e.target as HTMLFormElement).reset()
    refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    refresh()
  }

  function startEdit(item: Event) {
    setEditingId(item.id)
    setCoverUrl(item.cover_image_url)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 border border-slate-200 rounded-xl p-5 mb-8">
        <p className="font-mono text-xs text-slate-400">{editingId ? `editing: ${editing?.title}` : 'new_event()'}</p>
        <input name="title" placeholder="Title" defaultValue={editing?.title ?? ''} required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <textarea name="description" placeholder="Description / recap" defaultValue={editing?.description ?? ''} rows={3}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <input name="event_date" type="date" defaultValue={editing?.event_date ? editing.event_date.slice(0, 10) : ''}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <input name="location" placeholder="Location" defaultValue={editing?.location ?? ''}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <input name="link" type="url" placeholder="External link (optional)" defaultValue={editing?.link ?? ''}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40" />
        <div>
          <label className="text-sm text-brand-orange font-medium cursor-pointer">
            {uploading ? 'Uploading…' : coverUrl ? 'Cover image selected ✓' : 'Upload cover image'}
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" disabled={uploading} />
          </label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors">
            {editingId ? 'save_changes()' : 'add_event()'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setCoverUrl(null) }} className="text-sm text-slate-500 px-4">
              cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-3 min-w-0">
              {item.cover_image_url && <img src={item.cover_image_url} className="h-10 w-10 rounded object-cover shrink-0" />}
              <p className="text-sm font-medium text-navy truncate">{item.title}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => startEdit(item)} className="text-xs text-brand-orange font-medium">edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 font-medium">delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
