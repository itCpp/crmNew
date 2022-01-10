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