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