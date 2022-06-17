import Expenses from "./Expenses";

export const sortRowsFromDate = data => {
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export {
    Expenses,
}

export default Expenses;