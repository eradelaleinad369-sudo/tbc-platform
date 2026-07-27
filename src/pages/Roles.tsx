import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Role = {
  id: string
  title: string
  slug: string
  members: { full_name: string }[]
}

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('roles')
      .select('id, title, slug, members(full_name)')
      .order('sort_order')
      .then(({ data }) => {
        setRoles((data as any) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-12">
        <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">Who leads what</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy leading-tight">Leadership Roles</h1>
      </div>

      {loading && <p className="text-slate-400">Loading roles…</p>}

      <div className="divide-y divide-slate-200">
        {roles.map((role) => (
          <div key={role.id} className="flex items-center justify-between py-5">
            <h2 className="font-display text-lg text-navy">{role.title}</h2>
            <p className="text-sm">
              {role.members?.length ? (
                role.members.map((m) => m.full_name).join(', ')
              ) : (
                <span className="text-slate-400 italic">Open</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
