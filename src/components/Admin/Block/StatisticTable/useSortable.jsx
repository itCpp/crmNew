import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Dropdown } from "semantic-ui-react";

const DropdownSortable = props => {

    const { sort, setSort, setRows, sortable } = props;

    const direction = String(sort?.direction);

    let columnsArray = String(sort?.column).split(",");
    const columns = columnsArray[0] === "" ? [] : columnsArray;

    const column = columns.length > 0 ? columns.join(",") : "";

    const onChangeSortColumn = (e, { checked, value }) => {

        let key = columns.indexOf(value);

        if (checked && !columns.includes(value)) {
            columns.push(value);
        } else if (!checked && key >= 0) {
            columns.splice(key, 1);
        }

        const column = columns.length > 0 ? columns.join(",") : "";

        setSort(prev => ({ ...prev, column }));
        setRows(prev => prev.sort((a, b) => sortable(a, b, column, direction)));
    }

    const onChangeSortDirection = direction => {
        setSort(prev => ({ ...prev, direction }));
        setRows(prev => prev.sort((a, b) => sortable(a, b, column, direction)));
    }

    return <Dropdown
        trigger={<Button
            basic
            icon="sort"
            basic
            circular
        />}
        icon={null}
        simple
        direction="left"
        style={{ zIndex: 101 }}
        title="Сортировка"
    >
        <Dropdown.Menu>

            <Dropdown.Header>Сортировка</Dropdown.Header>

            <Dropdown.Divider />

            <Dropdown.Item
                icon="sort content ascending"
                text="По возрастанию"
                active={direction.indexOf("ascending") >= 0}
                onClick={() => onChangeSortDirection("ascending")}
            />

            <Dropdown.Item
                icon="sort content descending"
                text="По убыванию"
                active={direction.indexOf("descending") >= 0}
                onClick={() => onChangeSortDirection("descending")}
            />

            <Dropdown.Divider />

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="host"
                    checked={columns.indexOf("host") >= 0}
                    label="Хост"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="visits"
                    checked={columns.indexOf("visits") >= 0}
                    label="Посещений"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="requests"
                    checked={columns.indexOf("requests") >= 0}
                    label="Заявок"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="requests_all"
                    checked={columns.indexOf("requests_all") >= 0}
                    label="Заявок всего"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="queues"
                    checked={columns.indexOf("queues") >= 0}
                    label="Очередь"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="queues_all"
                    checked={columns.indexOf("queues_all") >= 0}
                    label="Вся очередь"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="visits_drops"
                    checked={columns.indexOf("visits_drops") >= 0}
                    label="Блок. входы"
                />
            </Dropdown.Item>

            <Dropdown.Item>
                <Checkbox
                    onChange={onChangeSortColumn}
                    value="visits_all"
                    checked={columns.indexOf("visits_all") >= 0}
                    label="Все посещения"
                />
            </Dropdown.Item>

        </Dropdown.Menu>
    </Dropdown>
}

export default (props => {

    const { setRows } = props;
    const [sort, setSort] = useState({});

    const searchParams = new URLSearchParams(props?.location?.search || "");

    const sortable = useCallback((a, b, column, direction) => {

        let sortable_a, sortable_b;
        let columns = column.split(",");

        for (var i = 0, l = columns.length; i < l; i++) {

            column = columns[i];

            sortable_a = a[column];
            sortable_b = b[column];

            if (typeof sortable_a == "undefined") return 0;

            if (column === "host" || column === "ip") {
                sortable_a = String(sortable_a).toLowerCase();
                sortable_b = String(sortable_b).toLowerCase();
            }

            if (direction === "ascending") {
                if (sortable_a > sortable_b) return 1;
                if (sortable_a < sortable_b) return -1;
            } else {
                if (sortable_a > sortable_b) return -1;
                if (sortable_a < sortable_b) return 1;
            }

        }

        return 0;

    }, []);

    const startSort = useCallback(column => {

        let direction = column === sort.column
            ? sort.direction === "ascending" ? "descending" : "ascending"
            : "descending";

        setSort({ column, direction });
        setRows(prev => prev.sort((a, b) => sortable(a, b, column, direction)));

    }, [sort]);

    useEffect(() => {

        if (Object.keys(sort).length > 0) {

            for (let i in sort)
                searchParams.set(i, sort[i]);

            let search = searchParams.toString();

            if (search !== "")
                props.history.replace(`${props.location.pathname}?${search}`);
        }

    }, [sort]);

    return {
        sort,
        setSort,
        startSort,
        sortable,
        searchParams,
        DropdownSortable: () => <DropdownSortable
            sort={sort}
            setSort={setSort}
            setRows={setRows}
            sortable={sortable}
        />
    };
})