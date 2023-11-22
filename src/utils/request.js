// import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../components/Login";

const requestInstance = axios.create();
const API_URL = process.env.REACT_APP_DISCOVEMAIL_API;

// Configuration can be invoked here before every request we make by axios
// Add a request interceptor
requestInstance.interceptors.request.use(
  (config) => {
    const connection = navigator.onLine;
    if (connection === false) {
      alert("No Internet Connection");
      return false;
    }
    config.baseURL =
      process.env.NODE_ENV === "production"
        ? API_URL
        : API_URL;
    // config.adapter = fetchAdapter;
    const token = localStorage.getItem("extension");
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    alert(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
requestInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === "401") {
      localStorage.clear("UserInfo");
      //window.location.pathname = "/";
    }
    // if(error?.response?.status == "403"){
    //  localStorage.clear();
    //  if(window.location.pathname = "Login"){
    //   return <Login/>
    //  }
     //}

    if (error.message === "Network Error") {
      // alert("network error");
      //   toast.error(error.message);
    }
    if (error?.response?.data?.status) {
      //console.log(error.response)
      toast.error(error?.response?.data?.message)
  }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default requestInstance;
