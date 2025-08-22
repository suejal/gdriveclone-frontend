import { useState } from "react";
import { useAuth } from "../../store/auth";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Signed in");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to sign in");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? <><Loader2 className="animate-spin" size={16}/> Signing in...</> : "Sign in"}
      </button>
    </form>
  );
}

