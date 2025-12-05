import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "header.title": "NotesApp",
            "header.welcome": "Welcome,",
            "header.dashboard": "Dashboard",
            "header.logout": "Logout",
            "header.login": "Login",
            "header.register": "Sign Up",
            "landing.title": "Welcome to NotesApp",
            "landing.description": "Your advanced notes and tasks manager.",
            "landing.login": "Go to Login",
            "landing.register": "Create an Account",
            "login.title": "Login to your account",
            "login.success": "Logged in successfully!",
            "login.error": "Invalid credentials. Please try again.",
            "login.submitButton": "Login",
            "login.noAccount": "Don't have an account?",
            "login.registerLink": "Register here",
            "register.title": "Create a new account",
            "register.success": "Account created successfully! Please log in.",
            "register.error": "Registration failed. The email might already be in use.",
            "register.submitButton": "Register",
            "register.hasAccount": "Already have an account?",
            "register.loginLink": "Login here",
            "dashboard.title": "My Notes",
            "dashboard.newNote": "New Note",
            "dashboard.searchPlaceholder": "Search notes...",
            "dashboard.fetchError": "Failed to fetch notes.",
            "profile.title": "My Profile",
            "profile.updateSuccess": "Profile updated successfully!",
            "profile.updateError": "Failed to update profile.",
            "profile.saveButton": "Save Changes",
            "shareModal.title": "Share Note",
            "shareModal.shareSuccess": "Note shared successfully!",
            "shareModal.shareError": "Failed to share note.",
            "shareModal.shareButton": "Share",
            "common.email": "Email",
            "common.password": "Password",
            "common.name": "Name",
            "common.loading": "Loading...",
            "common.submitting": "Submitting...",
            "common.saving": "Saving...",
            "common.save": "Save",
            "common.cancel": "Cancel",
            "common.sharing": "Sharing...",
            "common.delete": "Delete",
            "validation.emailRequired": "Email is required.",
            "validation.passwordRequired": "Password is required.",
            "validation.passwordMinLength": "Password must be at least 8 characters.",
            "validation.nameRequired": "Name is required.",
        }
    },
    vi: {
        translation: {
            "header.title": "Ghi Chú",
            "header.welcome": "Chào,",
            "header.dashboard": "Bảng điều khiển",
            "header.logout": "Đăng xuất",
            "header.login": "Đăng nhập",
            "header.register": "Đăng ký",
            "landing.title": "Chào mừng đến với Ứng dụng Ghi chú",
            "landing.description": "Trình quản lý ghi chú và công việc nâng cao của bạn.",
            "login.title": "Đăng nhập vào tài khoản",
            "login.success": "Đăng nhập thành công!",
            "login.error": "Thông tin không hợp lệ. Vui lòng thử lại.",
            "login.submitButton": "Đăng nhập",
            "login.noAccount": "Chưa có tài khoản?",
            "login.registerLink": "Đăng ký tại đây",
            "register.title": "Tạo tài khoản mới",
            "register.success": "Tạo tài khoản thành công! Vui lòng đăng nhập.",
            "register.error": "Đăng ký thất bại. Email có thể đã được sử dụng.",
            "register.submitButton": "Đăng ký",
            "register.hasAccount": "Đã có tài khoản?",
            "register.loginLink": "Đăng nhập tại đây",
            "dashboard.title": "Ghi chú của tôi",
            "dashboard.newNote": "Ghi chú mới",
            "dashboard.searchPlaceholder": "Tìm kiếm ghi chú...",
            "dashboard.fetchError": "Không thể tải ghi chú.",
            "profile.title": "Hồ sơ của tôi",
            "profile.updateSuccess": "Cập nhật hồ sơ thành công!",
            "profile.updateError": "Cập nhật hồ sơ thất bại.",
            "profile.saveButton": "Lưu thay đổi",
            "shareModal.title": "Chia sẻ ghi chú",
            "shareModal.shareSuccess": "Chia sẻ ghi chú thành công!",
            "shareModal.shareError": "Chia sẻ ghi chú thất bại.",
            "shareModal.shareButton": "Chia sẻ",
            "common.email": "Email",
            "common.password": "Mật khẩu",
            "common.name": "Tên",
            "common.loading": "Đang tải...",
            "common.submitting": "Đang gửi...",
            "common.saving": "Đang lưu...",
            "common.save": "Lưu",
            "common.cancel": "Hủy",
            "common.sharing": "Đang chia sẻ...",
            "common.delete": "Xóa",
            "validation.emailRequired": "Email là bắt buộc.",
            "validation.passwordRequired": "Mật khẩu là bắt buộc.",
            "validation.passwordMinLength": "Mật khẩu phải có ít nhất 8 ký tự.",
            "validation.nameRequired": "Tên là bắt buộc."
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Ngôn ngữ mặc định
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;