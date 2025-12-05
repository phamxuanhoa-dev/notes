import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import NotesList from '../components/NotesList';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { t } = useTranslation();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (searchTerm) {
                    params.append('q', searchTerm);
                }
                const response = await axiosClient.get(`/api/notes?${params.toString()}`);
                setNotes(response.data);
            } catch (error) {
                toast.error(t('dashboard.fetchError'));
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchNotes();
        }, 300); // Debounce search input

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, t]);

    const handleNoteDeleted = (deletedNoteId) => {
        setNotes(notes.filter(note => note.id !== deletedNoteId));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
                <Link
                    to="/notes/new"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                    {t('dashboard.newNote')}
                </Link>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder={t('dashboard.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>

            {loading ? (
                <p>{t('common.loading')}</p>
            ) : (
                <NotesList notes={notes} onNoteDeleted={handleNoteDeleted} />
            )}
        </div>
    );
}
