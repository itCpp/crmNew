import _ from 'lodash'
import axios from "./axios-header";

export {
    axios
};

export const replaceJSX = (str, find, replace) => {

    let parts = String(str).split(find),
        result = [];

    console.log(parts, str);

    if (parts.length === 0)
        return str;

    for (let i = 0; i < parts.length; i++) {
        result.push(parts[i]);
        result.push(replace);
    }

    return result;
}

export const Highlighted = ({ text = '', highlight = '' }) => {

    if (!highlight.trim()) {
        return <span>{text}</span>
    }
    const regex = new RegExp(`(${_.escapeRegExp(highlight)})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.filter(part => part).map((part, i) => (
                regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
            ))}
        </span>
    )
}

export const getFormaterTime = timestamp => {

    let hours = Math.floor(timestamp / 60 / 60);
    let minutes = Math.floor(timestamp / 60) - (hours * 60);
    let seconds = timestamp % 60;

    let formater = [
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ];

    if (hours > 0)
        formater.unshift(hours.toString().padStart(2, '0'));

    return formater.join(':');
}