import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';
import NoteEditor from '../components/NoteEditor';
import { useTranslation } from 'react-i18next';

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const isNewNote = id === 'new';

    const [note, setNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(!isNewNote);

    useEffect(() => {
        if (!isNewNote) {
            const fetchNote = async () => {
                try {
                    const response = await axiosClient.get(`/api/notes/${id}`);
                    setNote(response.data);
                    setTitle(response.data.title);
                    setContent(response.data.content);
                } catch (error) {
                    toast.error(t('noteDetail.fetchError'));
                    navigate('/dashboard');
                } finally {
                    setLoading(false);
                }
            };
            fetchNote();
        }
    }, [id, isNewNote, navigate, t]);

    const handleSave = useCallback(async () => {
        const noteData = { title, content, tags: [] }; // Simple tag handling for now

        try {
            let response;
            if (isNewNote) {
                response = await axiosClient.post('/api/notes', noteData);
                toast.success(t('noteDetail.createSuccess'));
                navigate(`/notes/${response.data.id}`);
            } else {
                response = await axiosClient.put(`/api/notes/${id}`, noteData);
                setNote(response.data);
                toast.success(t('noteDetail.updateSuccess'));
            }
        } catch (error) {
            toast.error(t('noteDetail.saveError'));
        }
    }, [title, content, isNewNote, id, navigate, t]);

    if (loading) {
        return <p>{t('common.loading')}</p>;
    }

    return (
        <div>
            <NoteEditor
                note={isNewNote ? { title: '', content: '' } : note}
                onTitleChange={setTitle}
                onContentChange={setContent}
                onSave={handleSave}
            />
        </div>
    );
}