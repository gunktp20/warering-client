import { useAppDispatch } from "../app/hooks";
import { setCredential, logout } from "../features/auth/authSlice";
import Cookies from "js-cookie";
import api from "../services/api";

const useRefreshToken = () => {
    const dispatch = useAppDispatch()
    const refresh = async () => {
        try {
            const response = await api.get("/auth/refresh", {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })
            console.log('Refresh token is valid')
            dispatch(setCredential(response.data?.access_token));
            return response.data.access_token;
        } catch (err: any) {
            console.log('! Refresh token is not valid')
            dispatch(logout())
            Cookies.remove("refresh_token")
        }
    }
    return refresh;
}

export default useRefreshToken