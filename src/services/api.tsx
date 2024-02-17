import axios from "axios";
// import { useAppDispatch } from "../app/hooks";
// import { refreshToken } from "../features/auth/authSlice";

// const dispatch = useAppDispatch();
// const { token } = useAppSelector(state => state.auth)

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.request.use(
//   (config) => {
//     config.headers["Authorization"] = `Bearer ${token}`;

//     return config;
//   },
//   (err) => {
//     return Promise.reject(err);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {
//     if (err.response.status === 401) {
//       dispatch(refreshToken())
//       return
//     }
//     return Promise.reject(err);
//   }
// );


export default api;
