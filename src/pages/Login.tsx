import { FormEvent, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email') as string
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-sm">
        <p className="text-brand-green font-semibold">Check your email</p>
        <p className="text-slate-500 mt-2">We sent you a login link.</p>
      </div>
    )
  }

  return (
    <div className="max-w-sm">
      <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">Members only</p>
      <h1 className="font-display text-3xl text-navy mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required
          className="w-full border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-navy text-white font-semibold px-5 py-2.5 rounded-full hover:bg-brand-orange transition-colors">
          Send login link
        </button>
      </form>
    </div>
  )
}
