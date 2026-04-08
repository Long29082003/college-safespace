import axios from "../api/axios.js";
import { useAuth } from "./useAuth.js";

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get("/api/auth/refresh");
            const { newAccessToken, roles } = response.data;
            setAuth(prev => {
                return {
                    ...prev,
                    accessToken: newAccessToken,
                    roles
                };
            });
            return newAccessToken;
        } catch (error) {
            return error;
        };
    };

    return refresh;
};