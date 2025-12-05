import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

export default function NotesList({ notes, onNoteDeleted }) {
    const { t, i18n } = useTranslation();

    if (notes.length === 0) {
        return <p className="text-center text-gray-500">{t('notesList.noNotes')}</p>;
    }

    const handleDelete = async (noteId) => {
        if (window.confirm(t('notesList.deleteConfirm'))) {
            try {
                await axiosClient.delete(`/api/notes/${noteId}`);
                toast.success(t('notesList.deleteSuccess'));
                onNoteDeleted(noteId);
            } catch (error) {
                toast.error(t('notesList.deleteError'));
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
                <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg mb-2 truncate">
                            <Link to={`/notes/${note.id}`} className="hover:text-blue-500">{note.title}</Link>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                            {note.content ? note.content.substring(0, 100) : t('notesList.noContent')}
                        </p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>
                            {t('notesList.updated')} {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: i18n.language === 'vi' ? vi : undefined })}
                        </span>
                        <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700 font-semibold">
                            {t('common.delete')}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}