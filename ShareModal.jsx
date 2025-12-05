import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import { useTranslation } from 'react-i18next';

export default function ShareModal({ noteId, onClose }) {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            await axiosClient.post(`/api/notes/${noteId}/share`, data);
            toast.success(t('shareModal.shareSuccess'));
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('shareModal.shareError');
            toast.error(errorMessage);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">{t('shareModal.title')}</h3>
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
                        <label htmlFor="role" className="block text-sm font-medium mb-1">{t('shareModal.role')}</label>
                        <select
                            id="role"
                            {...register('role', { required: t('shareModal.roleRequired') })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        >
                            <option value="viewer">{t('shareModal.viewer')}</option>
                            <option value="editor">{t('shareModal.editor')}</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none">{t('common.cancel')}</button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300"
                        >
                            {isSubmitting ? t('common.sharing') : t('shareModal.shareButton')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}