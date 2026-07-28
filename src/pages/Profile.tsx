import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Session } from '@supabase/supabase-js'

type MemberRow = {
  id: string
  full_name: string
  discipline: string | null
  hobbies: string[] | null
  bio: string | null
  status: string
  member_id: string
}

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null)
  const [member, setMember] = useState<MemberRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('members')
      .select('id, full_name, discipline, hobbies, bio, status, member_id')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setMember(data as MemberRow)
        setLoading(false)
      })
  }, [session])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!member) return
    const form = new FormData(e.currentTarget)
    const hobbies = (form.get('hobbies') as string)
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean)

    const { error } = await supabase
      .from('members')
      .update({
        full_name: form.get('full_name'),
        discipline: form.get('discipline'),
        bio: form.get('bio'),
        hobbies,
      })
      .eq('id', member.id)

    if (!error) setSaved(true)
  }

  if (!session) return <p className="text-slate-500">Please <a href="/login" className="text-brand-orange">log in</a> first.</p>
  if (loading) return <p className="text-slate-400">Loading…</p>
  if (!member) return <p className="text-slate-500">No member profile found.</p>

  return (
    <div className="max-w-md">
      <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// {member.member_id}</p>
      <h1 className="font-display text-3xl text-navy mb-2">Edit Profile</h1>
      {member.status === 'pending' && (
        <p className="text-sm text-brand-orange mb-6">Your membership is pending admin approval.</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="text-xs text-slate-500 font-mono">full_name</label>
          <input name="full_name" defaultValue={member.full_name} required
            className="w-full border border-slate-300 rounded px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-mono">discipline</label>
          <input name="discipline" defaultValue={member.discipline ?? ''} placeholder="e.g. Computer Engineering"
            className="w-full border border-slate-300 rounded px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-mono">hobbies (comma separated)</label>
          <input name="hobbies" defaultValue={member.hobbies?.join(', ') ?? ''} placeholder="e.g. chess, football, reading"
            className="w-full border border-slate-300 rounded px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        </div>
        <div>
          <label className="text-xs text-slate-500 font-mono">bio</label>
          <textarea name="bio" defaultValue={member.bio ?? ''} rows={3}
            className="w-full border border-slate-300 rounded px-3 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        </div>
        {saved && <p className="text-brand-green text-sm">Saved.</p>}
        <button type="submit" className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors">
          save_profile()
        </button>
      </form>
    </div>
  )
}
