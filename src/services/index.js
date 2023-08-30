import axios from "axios";

const DOMAIN = import.meta.env.VITE_APP;
const instance = axios.create({
  baseURL: DOMAIN,
  timeout: 60000,
  validateStatus: undefined,
});

export default instance;