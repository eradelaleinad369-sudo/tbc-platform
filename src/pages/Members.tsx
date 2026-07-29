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
  avatar_url: string | null
  linkedin_url: string | null
  roles: { title: string } | null
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('members')
      .select('id, member_id, full_name, bio, discipline, hobbies, avatar_url, linkedin_url, roles(title)')
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
              <div className="flex items-start gap-3">
                {m.avatar_url ? (
                  <img src={m.avatar_url} alt={m.full_name} className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-display shrink-0">
                    {m.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-navy truncate">{m.full_name}</p>
                    <span className="text-[10px] text-white bg-navy px-2 py-0.5 rounded-full font-mono shrink-0">{m.member_id}</span>
                  </div>
                  {m.roles?.title && <p className="text-sm text-brand-orange mt-0.5 font-medium">{m.roles.title}</p>}
                  {m.discipline && <p className="text-xs text-slate-500 mt-0.5 font-mono">{m.discipline}</p>}
                </div>
              </div>
              {m.bio && <p className="text-sm text-slate-500 mt-3">{m.bio}</p>}
              {m.hobbies && m.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.hobbies.map((h) => (
                    <span key={h} className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              )}
              {m.linkedin_url && (
                <a
                  href={m.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-navy font-medium mt-3 hover:text-brand-orange transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
                  LinkedIn
                </a>
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
