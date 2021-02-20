import axios from 'axios'
import Cookies from 'js-cookie'

// Базовые настройки axios
let instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "json",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});


instance.getError = error => {

    const text = error?.response?.data?.message
        ? error?.response?.data?.message
        : error?.response?.statusText
            ? error?.response?.statusText
            : "Неизвестная ошибка"

    // console.error(error?.response || "Неизвестная ошибка");
    return text;

}

instance.getErrors = error => {

    return error?.response?.data?.errors || {};

}

// Отслеживание токена
instance.interceptors.request.use(function (config) {

    const token = Cookies.get('token') || localStorage.getItem('token');

    config.baseURL += (token || "badtoken") + "/";

    config.headers.Authorization = token ? token : null;
    config.headers['X-Requested-Version'] = process.env.REACT_APP_VERSION || null;

    return config;

});

export default instance