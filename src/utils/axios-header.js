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

    if (!error?.response)
        console.error(error);

    // console.error(error?.response || error);
    return text;

}

instance.getErrors = error => {

    return error?.response?.data?.errors || {};

}

// Отслеживание токена
instance.interceptors.request.use(function (config) {

    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";
    const token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);

    config.headers.Authorization = token ? token : null;
    config.headers['X-Requested-Version'] = process.env.REACT_APP_VERSION || null;

    return config;

});

export default instance