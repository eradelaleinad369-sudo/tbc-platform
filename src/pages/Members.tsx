import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import RevealOnScroll from '../components/RevealOnScroll'

type Member = {
  id: string
  member_id: string
  full_name: string
  bio: string | null
  discipline: string | null
  hobbies: string[] | null
  roles: { title: string } | null
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('members')
      .select('id, member_id, full_name, bio, discipline, hobbies, roles(title)')
      .eq('status', 'active')
      .then(({ data }) => {
        setMembers((data as any) ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="text-brand-green font-mono text-sm tracking-widest uppercase mb-2">// the community</p>
        <h1 className="font-display text-3xl md:text-4xl text-navy">Members</h1>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((m, i) => (
          <RevealOnScroll key={m.id} delay={i * 60}>
            <div className="lift-card border border-slate-200 rounded-xl p-5 h-full">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-navy">{m.full_name}</p>
                <span className="text-[10px] text-white bg-navy px-2 py-0.5 rounded-full font-mono">{m.member_id}</span>
              </div>
              {m.roles?.title && <p className="text-sm text-brand-orange mt-1 font-medium">{m.roles.title}</p>}
              {m.discipline && <p className="text-xs text-slate-500 mt-1 font-mono">{m.discipline}</p>}
              {m.bio && <p className="text-sm text-slate-500 mt-2">{m.bio}</p>}
              {m.hobbies && m.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.hobbies.map((h) => (
                    <span key={h} className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </RevealOnScroll>
        ))}
        {!loading && members.length === 0 && (
          <p className="text-slate-400 text-sm">No active members yet.</p>
        )}
      </div>
    </div>
  )
}
