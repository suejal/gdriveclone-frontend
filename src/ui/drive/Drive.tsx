import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../store/auth";
import { useDropzone } from "react-dropzone";
import { FolderPlus, UploadCloud, Search, ChevronRight, ChevronLeft, Link2, Eye, ExternalLink } from "lucide-react";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

export default function Drive() {
  const { token } = useAuth();
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [parent, setParent] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id:string|null;name:string}[]>([{id:null,name:"My Drive"}]);
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [sort, setSort] = useState<"created_at"|"name"|"size">("created_at");
  const [order, setOrder] = useState<"asc"|"desc">("desc");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [preview, setPreview] = useState<{open:boolean; url?:string; name?:string}>({open:false});
  const [sharing, setSharing] = useState<{open:boolean; fileId?:string}>({open:false});
  const [uploading, setUploading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async ()=>{
    if (!token) return;
    try {
      const params = { parent, folder: parent, limit, offset, sort, order } as any;
      const [f1, f2] = await Promise.all([
        api.get("/api/folders", { params }),
        q ? api.get("/api/search", { params: { q } }) : api.get("/api/files", { params }),
      ]);
      setFolders(f1.data);
      setFiles(q ? f2.data.files : f2.data);
    } catch (err: any) {
      console.error(err);
    }
  }, [token, parent, limit, offset, sort, order, q]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onDrop = async (accepted: File[]) => {
    setUploading(true);
    try {
      for (const file of accepted) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        await api.post("/api/files/upload", {
          name: file.name,
          mime_type: file.type || "application/octet-stream",
          content_base64: base64,
          folder_id: parent,
        });
      }
      await fetchData();
      toast.success("Upload complete");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const filtered = useMemo(() => {
    if (!q) return { folders, files };
    const ql = q.toLowerCase();
    return {
      folders: folders.filter(f => f.name?.toLowerCase().includes(ql)),
      files: files.filter(f => f.name?.toLowerCase().includes(ql)),
    };
  }, [folders, files, q]);

  function openFolder(f:any){
    setParent(f.id);
    setBreadcrumbs(prev => [...prev, { id: f.id, name: f.name || "(untitled)" }]);
    setOffset(0);
  }
  function goToCrumb(i:number){
    const crumb = breadcrumbs[i];
    setBreadcrumbs(prev => prev.slice(0, i+1));
    setParent(crumb.id);
    setOffset(0);
  }

  async function createFolder(){
    if (!newFolderName.trim()) return;
    await api.post("/api/folders", { name: newFolderName, parent_folder_id: parent });
    setCreatingFolder(false);
    setNewFolderName("");
    fetchData();
  }

  async function previewFile(f:any){
    const { data } = await api.get(`/api/files/${f.id}/signed-url`);
    setPreview({ open: true, url: data.url, name: f.name });
  }

  async function shareFile(f:any){
    setSharing({ open: true, fileId: f.id });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
          <input className="input pl-8" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
        <button className="btn-soft" onClick={()=>setCreatingFolder(true)}><FolderPlus size={16}/> New Folder</button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        {breadcrumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <button className="hover:underline" onClick={()=>goToCrumb(i)}>{c.name}</button>
            {i < breadcrumbs.length-1 && <ChevronRight size={14}/>}
          </div>
        ))}
      </div>

      <div {...getRootProps()} className={`card p-6 border-dashed ${isDragActive ? 'border-primary-400 bg-primary-50' : ''}`}>
        <input {...getInputProps()} />
        <div className="flex items-center gap-3 text-slate-600">
          <UploadCloud />
          <div>
            <div className="font-medium">Drag & drop files here</div>
            <div className="text-sm">or click to upload</div>
          </div>
          {uploading && <div className="ml-auto text-sm">Uploading...</div>}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Sort</span>
          <select className="input" value={sort} onChange={e=>setSort(e.target.value as any)}>
            <option value="created_at">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <select className="input" value={order} onChange={e=>setOrder(e.target.value as any)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-soft" onClick={()=> setOffset(Math.max(0, offset - limit))}><ChevronLeft size={16}/> Prev</button>
          <button className="btn-soft" onClick={()=> setOffset(offset + limit)}>Next <ChevronRight size={16}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.folders.map((f) => (
          <button key={f.id} className="card p-4 text-left hover:bg-base-100" onClick={()=>openFolder(f)}>📁 {f.name || "(untitled)"}</button>
        ))}
        {filtered.files.map((f) => (
          <div key={f.id} className="card p-4 flex items-center justify-between">
            <div>📄 {f.name}</div>
            <div className="flex gap-2">
              <button className="btn-soft" onClick={()=>previewFile(f)}><Eye size={16}/> Preview</button>
              <a className="btn-soft" href="#" onClick={async (e)=>{ e.preventDefault(); const {data}=await api.get(`/api/files/${f.id}/signed-url`); window.open(data.url,'_blank'); }}><ExternalLink size={16}/> Open</a>
              <button className="btn-soft" onClick={()=>shareFile(f)}><Link2 size={16}/> Share</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={creatingFolder} onClose={()=>setCreatingFolder(false)} title="New Folder">
        <div className="space-y-3">
          <input className="input" placeholder="Folder name" value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} />
          <div className="flex justify-end gap-2">
            <button className="btn-soft" onClick={()=>setCreatingFolder(false)}>Cancel</button>
            <button className="btn-primary" onClick={createFolder}>Create</button>
          </div>
        </div>
      </Modal>

      <Modal open={preview.open} onClose={()=>setPreview({open:false})} title={preview.name || "Preview"}>
        {preview.url ? (
          preview.name?.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
            <img className="w-full rounded-xl" src={preview.url} alt="preview" />
          ) : preview.name?.match(/\.(pdf)$/i) ? (
            <iframe className="w-full h-[60vh] rounded-xl" src={preview.url}></iframe>
          ) : (
            <a className="btn-primary" href={preview.url} target="_blank">Open</a>
          )
        ) : (
          <div className="text-sm text-slate-600">Loading...</div>
        )}
      </Modal>

      <Modal open={sharing.open} onClose={()=>setSharing({open:false})} title="Share">
        <SharePanel fileId={sharing.fileId!} onClose={()=>setSharing({open:false})} />
      </Modal>
    </div>
  );
}

function SharePanel({ fileId, onClose }: { fileId: string; onClose: ()=>void }){
  const [role, setRole] = useState<'viewer'|'editor'>("viewer");
  const [expires, setExpires] = useState(600);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(()=>{ (async()=>{ const {data}=await api.get('/api/shares', { params: { file_id: fileId } }); setLinks(data.shares); })(); },[fileId]);

  async function createLink(){
    const { data } = await api.post('/api/shares', { file_id: fileId, role, expires_in: expires });
    toast.success('Share link created');
    setLinks([data.share, ...links]);
  }
  async function revoke(id:string){
    await api.delete(`/api/shares/${id}`);
    setLinks(links.filter(l=>l.id!==id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select className="input" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <input className="input w-32" type="number" min={60} step={60} value={expires} onChange={e=>setExpires(parseInt(e.target.value,10)||600)} />
        <button className="btn-primary" onClick={createLink}>Create link</button>
      </div>
      <div className="space-y-2">
        {links.length===0 && <div className="text-sm text-slate-600">No links yet.</div>}
        {links.map(l=> (
          <div key={l.id} className="flex items-center justify-between bg-base-100 p-3 rounded-xl">
            <div className="text-sm">/s/{l.token} · {l.role} {l.expires_at ? `· expires ${new Date(l.expires_at).toLocaleString()}` : ''}</div>
            <div className="flex gap-2">
              <button className="btn-soft" onClick={()=>navigator.clipboard.writeText(`${location.origin}/s/${l.token}`)}>Copy</button>
              <button className="btn-soft" onClick={()=>revoke(l.id)}>Revoke</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end"><button className="btn-soft" onClick={onClose}>Close</button></div>
    </div>
  );
}

