import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function Trash(){
  const [files, setFiles] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get('/api/trash'); setFiles(data); })(); },[]);
  return (
    <div className="space-y-4">
      {files.length === 0 && <div className="card p-6">Trash is empty.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.map((f)=>(
          <div key={f.id} className="card p-4 flex items-center justify-between">
            <div>🗑️ {f.name}</div>
            <div className="flex gap-2">
              <button className="btn-soft" onClick={async()=>{ await api.post(`/api/files/${f.id}/restore`); setFiles(files.filter(x=>x.id!==f.id)); }}>Restore</button>
              <button className="btn-soft" onClick={async()=>{ await api.delete(`/api/files/${f.id}`); setFiles(files.filter(x=>x.id!==f.id)); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

