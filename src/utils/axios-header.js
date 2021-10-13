import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-semantic-toasts';

// Базовые настройки axios
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    responseType: "json",
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Отслеживание токена
instance.interceptors.request.use(function (config) {

    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";
    const token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);

    config.headers.Authorization = token ? token : null;
    config.headers['X-Requested-Version'] = process.env.REACT_APP_VERSION || null;

    if (window.Echo)
        config.headers['X-Socket-ID'] = window.Echo.socketId();

    let godMode = localStorage.getItem('god-mode-id');

    if (godMode)
        config.headers['X-God-Mode'] = godMode;

    return config;

});

/**
 * Обработка ошибок
 * @param {object} error Объект ошибки
 * @param {string} type Тип данных на вывод
 * @param {function|null} Отладочная функция
 * @returns
 */
instance.getError = (error, type = "message", callback = null) => {

    const response = {}

    if (error.response) {

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        response.message = error.response?.data?.message || error.response.statusText;
        response.data = error.response.data;
        response.status = error.response.status;
        response.statusText = error.response.statusText;
        response.headers = error.response.headers;

        if (typeof callback == "function")
            callback(error.response);

    } else if (error.request) {

        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the 
        // browser and an instance of
        // http.ClientRequest in node.js

        response.message = error.request?.data?.message || "Неизвестная ошибка";

        if (typeof callback == "function")
            callback(error.request);

    } else {

        // Something happened in setting up the request that triggered an Error

        response.message = error.message;

        if (typeof callback == "function")
            callback('Error ' + error.message);

    }

    if (typeof callback == "function")
        callback(error.config);

    return response[type] || null;

}

/** Вывод объекта ошибок при валидации данных */
instance.getErrors = error => error?.response?.data?.errors || {}

/**
 * Всплывающее уведомление с ошибкой
 * @param {object|string|null} error Объект ошибки ответа или текст сообщения
 * @param {object} options
 * @param {void} onClose
 * @param {void} onClick
 * @param {void} onDismiss
 * @retrun Сообщение об ошибке
 */
instance.toast = (
    error,
    options = {},
    onClose = () => null,
    onClick = () => null,
    onDismiss = () => null
) => {

    if (error && typeof error != "string")
        error = instance.getError(error);

    options.type = options.type || "error";

    if (!options.title) {
        if (options.type == "success")
            options.title = "Выполнено";
        else if (options.type == "warning")
            options.title = "Внимание";
    }

    options.title = options.title || "Ошибка";
    options.description = options.description || error;
    options.time = typeof options.time == "undefined" ? 5000 : options.time;
    options.animation = options.animation || "fly right";

    toast(options, onClose, onClick, onDismiss);

    return error;

}

export default instance