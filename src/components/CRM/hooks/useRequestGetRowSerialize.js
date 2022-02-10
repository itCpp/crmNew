import { useState, useEffect } from "react";

/**
 * Заполнение опций выбора формы
 * @param {object} data Объект данных результат работы функции API сервера
 * по адресу `{process.env.REACT_APP_API_URL}/api/requests/getRow`
 * @returns 
 */
export const useRequestGetRowSerialize = (data = {}) => {

    const [optionsData, setOptionsData] = useState(data);

    const [permits, setPermits] = useState({});
    const [statuses, setStatuses] = useState([]);
    const [cities, setCities] = useState([]);
    const [themes, setThemes] = useState([]);
    const [adresses, setAddresses] = useState([]);

    useEffect(() => {

        if (optionsData.permits) {
            setPermits(optionsData.permits);
        }

        if (optionsData.offices) {
            setAddresses([
                { id: null, name: "Не указан" },
                ...optionsData.offices
            ].map((office, key) => ({
                key,
                text: office.name,
                value: office.id,
                disabled: office.active === 0 ? true : false
            })));
        }

        if (optionsData.statuses) {
            setStatuses([
                {
                    text: "Не обработана",
                    value: 0,
                    id: 0,
                    disabled: permits?.request_set_null_status ? false : true,
                },
                ...optionsData.statuses
            ].map((status, key) => ({
                ...status, key, value: status.id, text: status.text
            })));
        }

        if (optionsData.cities) {
            setCities([null, ...optionsData.cities].map((city, key) => ({
                key, value: city, text: city || "Не определен"
            })));
        }

        if (optionsData.themes) {
            setThemes([null, ...optionsData.themes].map((theme, key) => ({
                key, value: theme, text: theme || "Не определена"
            })));
        }

    }, [optionsData]);

    return {
        permits,
        statuses,
        cities,
        themes,
        adresses,
        optionsData,
        setOptionsData
    }

}

export default useRequestGetRowSerialize;