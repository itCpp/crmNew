import axios from "./../../../../utils/axios-header";

/**
 * Копирование в буфер обмены номера телефона
 * 
 * @param {object} e Блок с номером и кнопкой
 * @param {string} phone  Номер телефона или идентификатор заявки
 * @return {null}
 */
export const copyPhone = (e, phone) => {
    navigator.clipboard.writeText(phone);
    const phoneText = e.currentTarget && e.currentTarget.querySelector('.to-copy-text');

    if (phoneText) {
        phoneText.classList.add('copyed');
        setTimeout(() => phoneText.classList.remove('copyed'), 300);
    }

    return null;
}