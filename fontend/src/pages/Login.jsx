import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function Login() {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            toast.success(t('login.success'));
            navigate('/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('login.error');
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">{t('login.title')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">{t('common.email')}</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: t('validation.emailRequired') })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">{t('common.password')}</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: t('validation.passwordRequired') })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isSubmitting ? t('common.submitting') : t('login.submitButton')}
                </button>
            </form>
            <p className="text-center mt-4">
                {t('login.noAccount')} <Link to="/register" className="text-blue-500 hover:underline">{t('login.registerLink')}</Link>
            </p>
        </div>
    );
}
