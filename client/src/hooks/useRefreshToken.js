import { axiosPrivate } from "../api/axios.js";
import { useAuth } from "./useAuth.js";

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axiosPrivate.get("/api/auth/refresh");
            const { newAccessToken } = response.data;
            setAuth(prev => {
                return {
                    ...prev,
                    accessToken: newAccessToken
                };
            });
            return newAccessToken;
        } catch (error) {
            return error;
        };
    };

    return refresh;
};