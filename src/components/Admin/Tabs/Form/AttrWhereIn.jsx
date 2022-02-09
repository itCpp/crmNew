import React from "react";
import axios from "./../../../../utils/axios-header";

import { Form, Dropdown } from "semantic-ui-react";

import FormSelectColumn from "./FormSelectColumn";

export default function AttrWhereIn(props) {

    const { columns, query, changeData } = props;
    const { loading, errors } = props;
    const tabError = props.error;

    const [load, setLoad] = React.useState(null);
    const [error, setError] = React.useState(null);

    const [loaded, setLoaded] = React.useState(null);

    const [preset, setPreset] = React.useState(typeof query.attr[0].preset != "undefined"
        ? query.attr[0].preset
        : null
    );
    const [list, setList] = React.useState(typeof query.attr[0].datalist != "undefined"
        ? query.attr[0].datalist
        : []
    );
    const [selected, setSelected] = React.useState(typeof query.attr[0].list != "undefined"
        ? query.attr[0].list
        : []
    );

    React.useEffect(() => {

        if (loaded) {
            changeAttrArray(null, { name: "list", value: selected, item: 0 });
        }

    }, [selected]);

    const changeAttrArray = (...a) => {

        const e = a[1] || a[0].currentTarget;

        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;

        let attr = [...query.attr];
        attr[e.item] = { ...attr[e.item], [e.name]: value };

        if (typeof attr[e.item].datalist == "undefined")
            attr[e.item].datalist = [];

        if (e.name === "list") {
            attr[e.item].datalist = value.map(row => {
                return list.find(r => r.value === row);
            });
        }

        changeData(null, { name: "attr", value: attr });
    }

    const changeAttr = (name, value, item = 0) => {

        if (name === "preset") {
            setPreset(value);
            setError(null);
        }

        changeAttrArray(null, { name, value, item });
    }

    React.useEffect(() => {

        if (preset) {

            setLoad(true);

            axios.post('dev/getListWhereIn', { preset }).then(({ data }) => {

                if (loaded) {
                    setList(data.list);
                    setSelected([]);
                }

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoad(false);
                setLoaded(true);
            });

        }
        else if (loaded) {
            setList([]);
        }

    }, [preset]);

    const handleAddition = (e, { value }) => {
        setList([...list, { text: value, value }]);
    }

    const handleChange = (e, { value }) => setSelected(value);

    return <div className="where-row">

        {query.attr.map((attr, i) => i === 0
            ? <div key={i}>

                <Form.Group>
                    <FormSelectColumn
                        columns={columns}
                        width={8}
                        changeAttr={changeAttr}
                        value={attr.column || ""}
                        item={0}
                        disabled={loading || tabError}
                    />
                    <Form.Select
                        label="Список занчений"
                        placeholder="Выберите список"
                        width={8}
                        options={[
                            { value: "mylist", text: "Свои значения" },
                            { value: "status", text: "Список статусов" },
                            { value: "sources", text: "Список источников" },
                            { value: "resources", text: "Список ресурсов" },
                        ].map((option, key) => ({
                            ...option,
                            key,
                            onClick: () => changeAttr("preset", option.value, i),
                        }))}
                        value={attr.preset || ""}
                        loading={load}
                        error={error ? true : false}
                        disabled={loading || tabError}
                    />
                </Form.Group>

                <Dropdown
                    options={list.map((row, key) => ({
                        key,
                        ...row
                    }))}
                    placeholder="Укажите или выберите значения"
                    search
                    selection
                    fluid
                    multiple
                    allowAdditions
                    value={selected}
                    onAddItem={handleAddition}
                    onChange={handleChange}
                    disabled={load || loading || tabError}
                    noResultsMessage="Ничего не найдено."
                />

            </div>
            : null
        )}

    </div>

}