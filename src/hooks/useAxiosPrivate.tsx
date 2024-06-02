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
        console.log("error axios private", error);
        const pervRequest = error?.config;
        console.log(
          "pervRequest",
          error?.response?.config?.headers?.Authorization
        );
        if (error?.response?.status === 403 && !pervRequest?.sent) {
          pervRequest.sent = true;

          const newAccessToken = await refresh();
          console.log("new access token", newAccessToken);
          dispatch(setCredential(newAccessToken));

          pervRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          console.log("merged prevRequest", pervRequest);
          if (
            `Bearer ${newAccessToken}` === pervRequest?.headers?.Authorization
          ) {
            console.log("Prev Bearer === Merged Bearer")
          }
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
