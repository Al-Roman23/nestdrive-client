import axios from 'axios';

// This Is The Central Axios Configuration For Backend Communication
const api = axios.create({
    // This Points To The Active NestDrive Server V1 API
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// This Interceptor Attaches The Access Token To Outgoing Requests
api.interceptors.request.use(
    (config) => {
        // This Retrieves The Token Stored From Last Successful Authentication
        const token = localStorage.getItem('nestdrive-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// This Interceptor Handles Global Response Behavior Like Unauthorized Errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // This Handles Cases Where The Access Token Might be Invalid Or Expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('nestdrive-refresh-token');

            if (refreshToken) {
                try {
                    // This Silently Re-Authenticates The User To Maintain High Performance Sync
                    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, { refreshToken });
                    const { accessToken } = res.data.data;

                    localStorage.setItem('nestdrive-token', accessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                    // This Retransmits The Original Interrupted Payload
                    return api(originalRequest);
                } catch (refreshError) {
                    // Protocol Failure: Terminating Corrupted Session Artifacts
                    localStorage.removeItem('nestdrive-token');
                    localStorage.removeItem('nestdrive-refresh-token');
                    localStorage.removeItem('nestdrive-user');
                    window.location.href = '/login';
                }
            } else {
                localStorage.removeItem('nestdrive-token');
                localStorage.removeItem('nestdrive-user');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
