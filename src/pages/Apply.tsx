import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Role = { id: string; title: string }

export default function Apply() {
  const [roles, setRoles] = useState<Role[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('roles').select('id, title').order('sort_order').then(({ data }) => setRoles(data ?? []))
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const { error } = await supabase.from('applications').insert({
      full_name: form.get('full_name'),
      email: form.get('email'),
      role_applied_for: form.get('role_applied_for') || null,
      message: form.get('message'),
    })
    if (error) setError(error.message)
    else setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-md">
        <p className="text-brand-green font-semibold">Application submitted.</p>
        <p className="text-slate-500 mt-2">We'll be in touch. Thanks for wanting to build with us.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">Join us</p>
      <h1 className="font-display text-3xl text-navy mb-6">Apply to The Builders Circle</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="full_name" placeholder="Full name" required
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        <input name="email" type="email" placeholder="Email" required
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        <select name="role_applied_for"
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange">
          <option value="">General membership (no specific role)</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
        <textarea name="message" placeholder="Why do you want to join?" rows={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-navy text-white font-semibold px-5 py-2.5 rounded-full hover:bg-brand-orange transition-colors">
          Submit application
        </button>
      </form>
    </div>
  )
}
