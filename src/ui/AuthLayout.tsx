import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh grid place-items-center bg-gradient-to-br from-primary-50 via-mint-100 to-peach-100">
      <div className="card w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-xl bg-primary-500" />
          <span className="text-lg font-semibold">Cloud Drive</span>
        </div>
        <Outlet />
        <div className="mt-6 text-center text-sm text-slate-500">
          <Link className="hover:underline" to="/signup">Create account</Link>
          <span className="mx-2">·</span>
          <Link className="hover:underline" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

