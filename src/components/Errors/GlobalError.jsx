import React from "react";
import { getError } from "./../../utils/axios-header";
import GodModeOff from "./../Admin/Users/GodModeGlobalOff";

const GlobalError = props => {

    const { error } = props;

    return <div className="global-error">

        {error?.response?.status && <div className="global-error-code">{error.response.status}</div>}
        <div className="global-error-message">{getError(error)}</div>

        <div className="global-error-remark"><small>Произошла серьёзная ошибка! Для начала попробуйте обновить страницу, затем, если обновление страницы не помогло, попробуйте очистить кэш браузера и удалить файлы cookie (как это сделать можно найти в интернете)</small></div>

        <div className="global-error-remark opacity-40"><small>Если же ничего не помогло, то уже сообщите об этом руководству или разработчикам</small></div>

        <GodModeOff />
        
    </div>

}

export default GlobalError;