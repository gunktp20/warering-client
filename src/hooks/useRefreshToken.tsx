import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import api from "../services/api";

const useRefreshToken = () => {
  const signOut = async () => {
    await api.post("/auth/logout");
  };

  const dispatch = useAppDispatch();

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
      await signOut();
      dispatch(logout());
      return err;
    }
  };
  return refresh;
};

export default useRefreshToken;
