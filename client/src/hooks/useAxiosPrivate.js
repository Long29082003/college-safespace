import { useEffect } from "react";
import { axiosPrivate } from "../api/axios.js";
import { useAuth } from "./useAuth.js";
import { useRefreshToken } from "./useRefreshToken.js";

export function useAxiosPrivate() {
    const { auth } = useAuth();
    const axios = axiosPrivate;
    const refresh = useRefreshToken();

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use((config) => {
            if (!config.headers["Authorization"]) config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
            return config
        }, (error) => {
            return Promise.reject(error);
        });

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error.config;

                if (error.response?.status === 403 && !previousRequest._retried) {
                    previousRequest._retried = true;
                    const newAccessToken = await refresh();
                    previousRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(previousRequest)
                };

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        };
    }, [auth]);

    return axios;
};