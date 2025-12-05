import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();

    return (
        <header className="bg-white dark:bg-gray-800 shadow">
            <div className="container mx-auto py-4 px-6 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-blue-600">{t('header.title')}</Link>

                <nav>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300">{t('header.welcome')} {user.name}</span>
                            <Link
                                to="/dashboard"
                                className="text-blue-600 hover:text-blue-800">{t('header.dashboard')}</Link>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {t('header.logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-blue-600 hover:text-blue-800">{t('header.login')}</Link>
                            <Link to="/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">{t('header.register')}</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}