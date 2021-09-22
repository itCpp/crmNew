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
 * @param {object|string} error Объект ошибки ответа или текст сообщения
 * @param {object} options
 * @param {null|function} onClose
 * @param {null|function} onClick
 * @param {null|function} onDismiss
 * @retrun Сообщение об ошибке
 */
instance.toast = (error, options = {}, onClose = null, onClick = null, onDismiss = null) => {

    if (typeof error != "string")
        error = instance.getError(error);

    options.type = options.type || "error";
    options.title = options.title || "Ошибка";
    options.description = options.description || <p>{error}</p>;
    options.time = options.time || 0;
    options.animation = options.animation || "fly right";

    toast(options);

    return error;

}

export default instance