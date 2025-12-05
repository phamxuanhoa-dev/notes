import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import axiosClient from '../api/axiosClient';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Profile() {
    const { t } = useTranslation();
    const { user, setTokens, accessToken, refreshToken } = useAuthStore();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            await axiosClient.put('/api/users/me', { name: data.name });
            // Refresh user data in the store by re-setting tokens
            // A better approach would be a dedicated `setUser` action
            setTokens(accessToken, refreshToken);
            toast.success(t('profile.updateSuccess'));
        } catch (error) {
            toast.error(t('profile.updateError'));
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{t('profile.title')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">{t('common.name')}</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name', { required: t('validation.nameRequired') })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">{t('common.email')}</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                    {isSubmitting ? t('common.saving') : t('profile.saveButton')}
                </button>
            </form>
        </div>
    );
}