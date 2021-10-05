import Echo from 'laravel-echo';
window.io = require('socket.io-client');

const connectEcho = async user => {

    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";

    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: process.env.REACT_APP_SOCKET_IO_URL,
        // path: '/ws/socket.io',
        auth: {
            headers: {
                Authorization: localStorage.getItem(tokenKey)
            }
        },
    });

}

export default connectEcho;

export const updateToken = token => {

    if (window.Echo)
        window.Echo.options.auth.headers.Authorization = token;

}