import axios from "axios";

const axiosService=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});
export default axiosService;