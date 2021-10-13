export const icons = {
    google: { name: "google", color: "blue" },
    yandex: { name: "yandex", color: "red" },
} 

/**
 * Список рекламных площадок для источников
 * 
 * @var {array}
 */
const places = [
    { text: "Без рекламной площадки", value: null },
    { text: "Google", value: "google" },
    { text: "Яндекс", value: "yandex" },
];

export default places.map(place => ({
    ...place,
    icon: icons[place.value] || null,
}));