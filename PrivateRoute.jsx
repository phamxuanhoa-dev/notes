import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function PrivateRoute() {
    const { accessToken } = useAuthStore();

    // Nếu có token, cho phép truy cập vào các route con (Outlet)
    // Nếu không, điều hướng về trang đăng nhập
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}