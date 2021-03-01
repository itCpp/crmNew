export default function date(date) {

    if (!date)
        return null;

    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();

    let string = "";
    string += day < 10 ? `0${day}` : day;
    string += ".";
    string += month < 10 ? `0${month}` : month;
    string += ".";
    string += year;

    return string;

}