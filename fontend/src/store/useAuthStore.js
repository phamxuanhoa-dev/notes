import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../api/axiosClient';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,

            // Set tokens and decode user info from access token
            setTokens: (accessToken, refreshToken) => {
                const decodedUser = accessToken ? jwtDecode(accessToken) : null;
                set({
                    accessToken,
                    refreshToken,
                    user: decodedUser ? { id: decodedUser.sub, ...decodedUser } : null,
                });
            },

            // Login action
            login: async (email, password) => {
                const response = await axiosClient.post('/api/auth/login', { email, password });
                const { access_token, refresh_token } = response.data;
                get().setTokens(access_token, refresh_token);
                return response.data;
            },

            // Logout action
            logout: () => {
                // Optionally call the backend to revoke the token
                // axiosClient.post('/api/auth/logout').catch(console.error);
                set({ accessToken: null, refreshToken: null, user: null });
            },
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
            // Only persist refreshToken for security. Access token is kept in memory.
            partialize: (state) => ({ refreshToken: state.refreshToken }),
        }
    )
);

// Initialize the store on app load
// This will check if a refresh token exists and try to get a new access token
const rehydrate = async () => {
    const { refreshToken, setTokens, logout } = useAuthStore.getState();
    if (refreshToken) {
        try {
            const response = await axiosClient.post('/api/auth/refresh', {}, {
                headers: { 'Authorization': `Bearer ${refreshToken}` }
            });
            setTokens(response.data.access_token, refreshToken);
        } catch (error) {
            console.error("Failed to refresh token on load", error);
            logout();
        }
    }
};

rehydrate();
