import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredential } from "../features/auth/authSlice";
import { axiosPrivate } from "../services/api";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const pervRequest = error?.config;
        if (error?.response?.status === 403 && !pervRequest?.sent) {
          pervRequest.sent = true;

          const newAccessToken = await refresh();
          dispatch(setCredential(newAccessToken));

          pervRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(pervRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token]);

  return axiosPrivate;
};

export default useAxiosPrivate;
