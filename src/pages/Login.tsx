import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        console.error('Login error:', error)
      } else if (!data.session) {
        setError('No session returned — unexpected response from Supabase.')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      console.error('Unexpected login exception:', err)
      setError('Unexpected error: ' + (err?.message ?? String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm">
      <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// members only</p>
      <h1 className="font-display text-3xl text-navy mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        <input name="password" type="password" placeholder="Password" required
          className="w-full border border-slate-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange" />
        {error && <p className="text-red-600 text-sm break-words">{error}</p>}
        <button type="submit" disabled={loading}
          className="bg-navy text-white font-mono text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-orange transition-colors disabled:opacity-50">
          {loading ? 'logging_in...' : 'login()'}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        No account yet? <Link to="/signup" className="text-brand-orange font-medium">Sign up</Link>
      </p>
    </div>
  )
}
