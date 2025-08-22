import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Shared(){
  const [links, setLinks] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get('/api/shares'); setLinks(data.shares); })(); },[]);
  return (
    <div className="space-y-4">
      {links.length === 0 && <div className="card p-6">No shared links yet.</div>}
      <div className="space-y-2">
        {links.map(l=> (
          <div key={l.id} className="flex items-center justify-between card p-3">
            <div className="text-sm">/s/{l.token} · {l.role} {l.expires_at ? `· expires ${new Date(l.expires_at).toLocaleString()}` : ''}</div>
            <div className="flex gap-2">
              <button className="btn-soft" onClick={()=>navigator.clipboard.writeText(`${location.origin}/s/${l.token}`)}>Copy</button>
              <button className="btn-soft" onClick={async()=>{ await api.delete(`/api/shares/${l.id}`); setLinks(links.filter(x=>x.id!==l.id)); }}>Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

