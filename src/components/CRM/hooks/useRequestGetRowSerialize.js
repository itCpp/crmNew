import { useState, useEffect } from "react";

/**
 * Заполнение опций выбора формы
 * @param {object} data Объект данных результат работы функции API сервера
 * по адресу `{process.env.REACT_APP_API_URL}/api/requests/getRow`
 * @returns 
 */
export const useRequestGetRowSerialize = (data = {}) => {

    const [rowData, setRowData] = useState(data);

    const [permits, setPermits] = useState({});
    const [statuses, setStatuses] = useState([]);
    const [cities, setCities] = useState([]);
    const [themes, setThemes] = useState([]);
    const [adresses, setAddresses] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {

        if (rowData.permits) {
            setPermits(rowData.permits);
        }

        if (rowData.offices) {
            setAddresses([
                { id: null, name: "Не указан" },
                ...rowData.offices
            ].map((office, key) => ({
                key,
                text: office.name,
                value: office.id,
                disabled: office.active === 0 ? true : false
            })));
        }

        if (rowData.statuses) {
            setStatuses([
                {
                    text: "Не обработана",
                    value: 0,
                    id: 0,
                    disabled: rowData.permits?.requests_set_null_status ? false : true,
                },
                ...rowData.statuses
            ].map((status, key) => ({
                ...status, key, value: status.id, text: status.text
            })));
        }

        if (rowData.cities) {
            setCities([null, ...rowData.cities].map((city, key) => ({
                key, value: city, text: city || "Не определен"
            })));
        }

        if (rowData.themes) {
            setThemes([null, ...rowData.themes].map((theme, key) => ({
                key, value: theme, text: theme || "Не определена"
            })));
        }

        if (rowData.comments) {
            setComments(rowData.comments);
        }

    }, [rowData]);

    return {
        permits,
        statuses,
        cities,
        themes,
        adresses,
        rowData,
        setRowData
    }

}

export default useRequestGetRowSerialize;