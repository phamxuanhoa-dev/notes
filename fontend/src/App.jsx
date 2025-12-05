import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import AuthLayout from './components/AuthLayout';
import Header from './components/Header';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Router>
                <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                    <Header />
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route element={<AuthLayout />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Route>

                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/notes/:id" element={<NoteDetail />} />
                                <Route path="/profile" element={<Profile />} />
                            </Route>
                        </Routes>
                    </main>
                    <Toaster position="bottom-right" />
                </div>
            </Router>
        </I18nextProvider>
    );
}

export default App;
