import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthLayout() {
    const { accessToken } = useAuthStore();

    // Nếu người dùng đã đăng nhập, điều hướng họ đến dashboard
    // thay vì hiển thị lại trang login/register.
    return accessToken ? <Navigate to="/dashboard" replace /> : <Outlet />;
}