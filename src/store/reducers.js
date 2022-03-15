import { combineReducers } from 'redux';
import { adCenterReducer } from './adCenter/reducers';
import { gatesReducer } from './gates/reducers';
import { adminReducer } from './admin/reducers';
import { requestsReducer } from './requests/reducers';
import { interfaceReducer } from './interface/reducers';

import * as ACTION from './actions';

export default combineReducers({
    requests: requestsReducer,
    admin: adminReducer,
    adCenter: adCenterReducer,
    gates: gatesReducer,
    interface: interfaceReducer,
    main: (state = {
        login: false, // Флаг авторизации
        userData: {}, // Данные текущего пользователя
        userPermits: {}, // Права текущего пользователя
        authQueries: 0, // Количество запросов на авторизацию
        online: [], // Список всех онлайн пользователей
        onlineId: [], // Идентификаторы онлайн пользователей
        worktime: {}, // Данные о рабочем времени сотрудника
        showMenu: false,
    }, action) => {

        let online = [],
            onlineId = [];

        switch (action.type) {

            case ACTION.SET_LOGIN:
                return { ...state, login: action.payload }

            case ACTION.SET_USER_DATA:
                return { ...state, userData: action.payload }

            case ACTION.SET_USER_PERMITS:
                return { ...state, userPermits: action.payload }

            case ACTION.SET_AUTH_QUERIES:
                return { ...state, authQueries: action.payload }

            case ACTION.CHANGE_AUTH_QUERIES:
                return { ...state, authQueries: (state.authQueries + action.payload) }

            /** Список онлайн и добавление нового пользователя */
            case ACTION.USERS_ONLINE:
            case ACTION.USER_JOIN:

                online = [...state.online];
                onlineId = [...state.onlineId];

                if (action.payload?.id) {
                    if (onlineId.indexOf(action.payload.id) < 0) {
                        online.push(action.payload);
                        onlineId.push(action.payload.id);
                    }
                }
                else {
                    action.payload.forEach(user => {
                        if (onlineId.indexOf(user.id) < 0) {
                            online.push(user);
                            onlineId.push(user.id);
                        }
                    });
                }

                return { ...state, online, onlineId }

            /** Выход пользователя */
            case ACTION.USER_LEAVE:

                online = [];
                onlineId = [];

                state.online.forEach(user => {
                    if (user.id !== action?.payload?.id) {
                        online.push(user);
                        onlineId.push(user.id);
                    }
                });

                return { ...state, online, onlineId }

            case ACTION.USER_WORK_TIME:
                return { ...state, worktime: action.payload }

            case ACTION.SET_SHOW_MENU:
                return { ...state, showMenu: action.payload }

            default:
                return state;

        }

    }
});