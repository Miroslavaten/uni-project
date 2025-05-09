// src/routes.tsx
import { Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage/MainPage";
import {useAuth} from "../hooks/useAuth.ts";
import {AuthForm} from "../components/Auth/AuthForm.tsx";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Загрузка авторизации...</div>;
  return (
    <Routes>
      {user ? <Route path="/" element={<MainPage />} /> : <Route path="/" element={<AuthForm/>}/>}
    </Routes>
  );
};

export default AppRoutes;
