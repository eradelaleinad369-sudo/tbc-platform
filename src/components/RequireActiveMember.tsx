import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function RequireActiveMember() {
  const { session, loading } = useAuth()
  const [status, setStatus] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!session) {
      setChecked(true)
      return
    }
    supabase
      .from('members')
      .select('status')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setStatus(data?.status ?? null)
        setChecked(true)
      })
  }, [session, loading])

  if (loading || !checked) return null
  if (!session) return <Navigate to="/login" replace />

  if (status !== 'active') {
    return (
      <div className="max-w-md">
        <p className="text-brand-orange font-semibold">Membership pending</p>
        <p className="text-slate-500 mt-2">
          Your account is awaiting admin approval. Once approved, you'll get access to this page. In the meantime
          you can fill in your details on your{' '}
          <a href="/profile" className="text-brand-orange font-medium">profile</a>.
        </p>
      </div>
    )
  }

  return <Outlet />
}
