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

export const secToDate = timestamp => {

    let hours = Math.floor(timestamp / 60 / 60);
    let minutes = Math.floor(timestamp / 60) - (hours * 60);
    let seconds = timestamp % 60;

    let format = [];

    if (hours > 0) format.push(hours.toString().padStart(2, '0'));
    format.push(minutes.toString().padStart(2, '0'));
    format.push(seconds.toString().padStart(2, '0'));

    return format.join(':');

}