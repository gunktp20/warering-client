import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {
//     if (err.response.status === 403) {
//       dispatch(refreshToken())
//       return
//     }
//     return Promise.reject(err);
//   }
// );


export default api;
