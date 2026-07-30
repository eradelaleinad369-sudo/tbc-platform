import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'

export default function RequireAdmin() {
  const { session, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!session) {
      setChecked(true)
      return
    }
    supabase
      .from('members')
      .select('is_admin')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(!!data?.is_admin)
        setChecked(true)
      })
  }, [session, loading])

  if (loading || !checked) return null
  if (!session) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}
