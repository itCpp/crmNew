import React from "react";
import { Button, Dropdown, Form, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const DropdownFilter = props => {

    const { site, disabled, load } = props;
    const { filters, setFilters } = props;
    const { filterUtm, handleFilterUtm } = props;

    const [add, setAdd] = React.useState(false);
    const [newUtm, setNewUtm] = React.useState("");
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        return () => {
            setSave(false);
            setNewUtm("");
            setError(null);
        }

    }, [add]);

    React.useEffect(() => {

        if (save) {
            axios.put('dev/block/allstatistics/setutm', { site, utm: newUtm })
                .then(({ data }) => {
                    setFilters(p => ([ data.row.utm_label, ...p]));
                    handleFilterUtm(data.row.utm_label);
                    setAdd(false);
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setSave(false));
        }

    }, [save]);

    return <>

        <Modal
            open={add}
            header="Новый utm параметр"
            centered={false}
            size="mini"
            closeIcon
            onClose={() => setAdd(false)}
            content={{
                content: <div>
                    <Form>

                        <Form.Input
                            label="UTM параметр"
                            placeholder="Введите значение параметра"
                            value={newUtm || ""}
                            onChange={(e, { value }) => setNewUtm(value)}
                            disabled={save}
                        />

                    </Form>

                    {error && <div className="mt-3 text-danger" style={{ opacity: save ? "0.4" : "1"}}>
                        <strong>Ошибка{' '}</strong>
                        <span>{error}</span>
                    </div>}

                    <Button
                        className="mt-3"
                        fluid
                        content="Добавить"
                        icon="plus"
                        labelPosition="right"
                        color="green"
                        disabled={String(newUtm).length === 0 || save}
                        onClick={() => setSave(true)}
                        loading={save}
                    />

                </div>
            }}
        />

        <Dropdown
            trigger={<Button
                basic
                icon="filter"
                circular
                color={(typeof filterUtm == "object" && filterUtm.length > 0) ? "green" : null}
            />}
            icon={null}
            simple
            direction="left"
            style={{ zIndex: 200 }}
            title="Сортировка"
            disabled={disabled}
        >
            <Dropdown.Menu>

                <Dropdown.Header>UTM фильтр</Dropdown.Header>

                <Dropdown.Divider className="my-0" />

                {filters.length === 0 && <div className="text-center px-3 my-2">
                    <small>Список пуст</small>
                </div>}

                {filters.map((row, i) => <Dropdown.Item
                    key={i}
                    content={row}
                    label={{
                        color: filterUtm.indexOf(row) >= 0 ? "green" : null,
                        empty: true,
                        circular: true
                    }}
                    onClick={() => handleFilterUtm(row)}
                    disabled={load}
                />)}

                <Dropdown.Divider className="my-0" />

                <Dropdown.Item
                    icon="plus"
                    text="Добавить UTM"
                    onClick={() => setAdd(true)}
                />

            </Dropdown.Menu>
        </Dropdown>
    </>
}

export default DropdownFilter;