import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Landing() {
    const { t } = useTranslation();

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('landing.title')}</h1>
            <p className="text-lg text-gray-600 mb-8">{t('landing.description')}</p>
            <div className="space-x-4">
                <Link
                    to="/login"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {t('landing.login')}
                </Link>
                <Link to="/register" className="inline-block text-sm px-4 py-2 leading-none border rounded text-blue-600 border-blue-600 hover:border-transparent hover:bg-blue-500 hover:text-white mt-4 md:mt-0">
                    {t('landing.register')}
                </Link>
            </div>
        </div>
    );
}