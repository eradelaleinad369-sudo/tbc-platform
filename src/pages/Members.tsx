import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Member = {
  id: string
  member_id: string
  full_name: string
  bio: string | null
  roles: { title: string } | null
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('members')
      .select('id, member_id, full_name, bio, roles(title)')
      .eq('status', 'active')
      .then(({ data }) => {
        setMembers((data as any) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="text-brand-green font-semibold text-sm tracking-wide uppercase mb-2">The community</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy">Members</h1>
      </div>

      {loading && <p className="text-slate-400">Loading members…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((m) => (
          <div key={m.id} className="border border-slate-200 rounded-xl p-5 hover:border-brand-orange/50 transition-colors">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-navy">{m.full_name}</p>
              <span className="text-[10px] text-white bg-navy px-2 py-0.5 rounded-full font-mono">{m.member_id}</span>
            </div>
            {m.roles?.title && <p className="text-sm text-brand-orange mt-1 font-medium">{m.roles.title}</p>}
            {m.bio && <p className="text-sm text-slate-500 mt-2">{m.bio}</p>}
          </div>
        ))}
        {!loading && members.length === 0 && (
          <p className="text-slate-400 text-sm">No active members yet — add some in Supabase's Table Editor.</p>
        )}
      </div>
    </div>
  )
}
