import { useState } from "react";
import { useAuth } from "../../store/auth";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup(email, password, name);
      toast.success("Account created");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to sign up");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input className="input" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" size={16}/> Creating...</> : "Create account"}
      </button>
    </form>
  );
}

