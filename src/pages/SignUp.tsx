import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function SignUp() {
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string
    const fullName = form.get('full_name') as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is off in Supabase, there's already a session — go straight in.
    if (data.session) {
      navigate('/dashboard')
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="max-w-sm">
        <p className="text-brand-green font-semibold">Check your email</p>
        <p className="text-slate-500 mt-2">
          Confirm your account, then log in. Your membership will show as pending until an admin approves it.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-sm">
      <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// create account</p>
      <h1 className="font-display text-3xl text-navy mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="full_name" placeholder="Full name" required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        <input name="email" type="email" placeholder="Email" required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        <input name="password" type="password" placeholder="Password" required minLength={6}
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors">
          sign_up()
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-brand-orange font-medium">Log in</Link>
      </p>
    </div>
  )
}
