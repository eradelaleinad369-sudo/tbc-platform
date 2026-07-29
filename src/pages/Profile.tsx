import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

type MemberRow = {
  id: string
  full_name: string
  discipline: string | null
  hobbies: string[] | null
  bio: string | null
  status: string
  member_id: string
  avatar_url: string | null
  linkedin_url: string | null
}

export default function Profile() {
  const { session } = useAuth()
  const [member, setMember] = useState<MemberRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    supabase
      .from('members')
      .select('id, full_name, discipline, hobbies, bio, status, member_id, avatar_url, linkedin_url')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setMember(data as MemberRow)
        setLoading(false)
      })
  }, [session])

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !session || !member) return
    setError(null)
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${session.user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const avatar_url = `${urlData.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('members')
      .update({ avatar_url })
      .eq('id', member.id)

    if (updateError) setError(updateError.message)
    else setMember({ ...member, avatar_url })
    setUploading(false)
  }

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
        linkedin_url: form.get('linkedin_url') || null,
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

      <div className="flex items-center gap-4 mt-6">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} className="h-16 w-16 rounded-full object-cover border border-slate-200" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-display text-xl">
            {member.full_name.charAt(0).toUpperCase()}
          </div>
        )}
        <label className="text-sm text-brand-orange font-medium cursor-pointer">
          {uploading ? 'Uploading…' : 'Change photo'}
          <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

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
          <label className="text-xs text-slate-500 font-mono">linkedin_url</label>
          <input name="linkedin_url" type="url" defaultValue={member.linkedin_url ?? ''} placeholder="https://linkedin.com/in/yourname"
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
