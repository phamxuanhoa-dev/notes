import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';

export default function NoteEditor({ note, onSave, onTitleChange, onContentChange }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
        }
    }, [note]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        onTitleChange(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        onContentChange(e.target.value);
    };

    const getMarkdownText = () => {
        const rawMarkup = marked(content, { sanitize: true });
        return { __html: rawMarkup };
    };

    return (
        <div className="space-y-6">
            <input
                type="text"
                placeholder={t('editor.titlePlaceholder')}
                value={title}
                onChange={handleTitleChange}
                className="w-full text-3xl font-bold bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 py-2"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
                {/* Markdown Editor */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{t('editor.markdown')}</h3>
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder={t('editor.contentPlaceholder')}
                        className="w-full h-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                    />
                </div>
                {/* Preview */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{t('editor.preview')}</h3>
                    <div
                        className="prose dark:prose-invert max-w-none w-full h-full p-3 border border-gray-300 rounded-md overflow-y-auto dark:bg-gray-800 dark:border-gray-600"
                        dangerouslySetInnerHTML={getMarkdownText()}
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    onClick={onSave}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    {t('common.save')}
                </button>
            </div>
        </div>
    );
}
