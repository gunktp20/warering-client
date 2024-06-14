import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const refresh = async () => {
    try {
      const { data } = await api.get("/auth/refresh", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return data.access_token;
    } catch (err: unknown) {

      if (err instanceof AxiosError) {
        dispatch(logout())
        navigate("/session-expired")
      }
      return null
    }
  };
  return refresh;
};

export default useRefreshToken;
