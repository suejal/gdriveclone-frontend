import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../ui/AuthLayout";
import DashboardLayout from "../ui/DashboardLayout";
import Login from "../ui/auth/Login";
import Signup from "../ui/auth/Signup";
import Drive from "../ui/drive/Drive";
import Shared from "../ui/drive/Shared";
import Trash from "../ui/drive/Trash";

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<DashboardLayout />}> 
        <Route path="/" element={<Drive />} />
        <Route path="/shared" element={<Shared />} />
        <Route path="/trash" element={<Trash />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

