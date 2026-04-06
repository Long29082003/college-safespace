import { useEffect } from "react";
import { axiosPrivate } from "../api/axios.js";
import { useAuth } from "./useAuth.js";

export function useAxiosPrivate() {
    const { auth } = useAuth();
    const axios = axiosPrivate;

    useEffect(() => {
        const requestIntercept = axios.interceptors.request.use((config) => {
            if (!config.headers["Authorization"]) config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
            console.log(config);
            return config
        }, (error) => {
            return Promise.reject(error);
        });

        return () => {
            axios.interceptors.request.eject(requestIntercept);
        };
    }, [auth]);

    return axios;
};