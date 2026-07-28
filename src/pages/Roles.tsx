import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import RevealOnScroll from '../components/RevealOnScroll'

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
        <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// who leads what</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy leading-tight">Leadership Roles</h1>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      <div className="divide-y divide-slate-200">
        {roles.map((role, i) => (
          <RevealOnScroll key={role.id} delay={i * 40}>
            <div className="flex items-center justify-between py-5 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors">
              <h2 className="font-display text-lg text-navy">{role.title}</h2>
              <p className="text-sm">
                {role.members?.length ? (
                  role.members.map((m) => m.full_name).join(', ')
                ) : (
                  <span className="text-slate-400 italic">Open</span>
                )}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  )
}
