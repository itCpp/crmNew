import React from "react";
import { Button, Checkbox, Dimmer, Dropdown, Form, Header, Icon, Label, List, Loader, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../../utils";

const DropdownFilter = props => {

    const { site, disabled, load } = props;
    const { filters, setFilters } = props;
    const { filtersRefferer, setFiltersRefferer } = props;
    const { filterUtm, filterRefferer, handleFilterUtm } = props;

    const [add, setAdd] = React.useState(false);
    const [newUtm, setNewUtm] = React.useState("");
    const [newRefferer, setNewRefferer] = React.useState("");
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [edit, setEdit] = React.useState(false);
    const [loadList, setLoadList] = React.useState(true);
    const [list, setList] = React.useState([]);

    React.useEffect(() => {

        return () => {
            setSave(false);
            setNewUtm("");
            setError(null);
        }

    }, [add]);

    React.useEffect(() => {

        if (edit) {
            setLoadList(true);
            axios.post('dev/block/allstatistics/getutm', { site })
                .then(({ data }) => {
                    setList(data.filters);
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setLoadList(false));
        }

        return () => {
            setError(null);
            setLoadList(true);
        }

    }, [edit]);

    React.useEffect(() => {

        if (save) {
            axios.put('dev/block/allstatistics/setutm', {
                site,
                utm: newUtm,
                refferer: newRefferer
            })
                .then(({ data }) => {

                    if (Boolean(data.utm))
                        setFilters(p => ([data.utm.utm_label, ...p]));

                    if (Boolean(data.refferer))
                        setFiltersRefferer(p => ([data.refferer.refferer_label, ...p]));

                    handleFilterUtm(data?.utm?.utm_label, data?.refferer?.refferer_label);

                    setAdd(false);
                })
                .catch(e => setError(axios.getError(e)))
                .then(() => setSave(false));
        }

    }, [save]);

    return <>

        <Modal
            open={add}
            header="Новый фильтр параметр"
            centered={false}
            size="mini"
            closeIcon
            onClose={() => setAdd(false)}
            content={{
                content: <div>

                    <Message info content="Можно вводить по отдельности каждое значение, либо одновременно и utm параметр, и реферальную ссылку. Пустое поле ввода будет проигнорировано" size="mini" />

                    <Form>

                        <Form.Input
                            label="UTM параметр"
                            placeholder="Введите значение параметра"
                            value={newUtm || ""}
                            onChange={(e, { value }) => setNewUtm(value)}
                            disabled={save}
                        />

                        <Form.Input
                            label="Реферальная ссылка"
                            placeholder="Например ex.su, http://ex.su"
                            value={newRefferer || ""}
                            onChange={(e, { value }) => setNewRefferer(value)}
                            disabled={save}
                            className="mb-0"
                        />

                        <div className="mb-3">
                            <small>Указанная реферальная ссылка добавит в запрос вывода условие <code>`column` LIKE {`'%{$refferer}%'`}</code></small>
                        </div>

                    </Form>

                    {error && <div className="mt-3 text-danger" style={{ opacity: save ? "0.4" : "1" }}>
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
                        disabled={(String(newUtm).length === 0 && String(newRefferer).length === 0) || save}
                        onClick={() => setSave(true)}
                        loading={save}
                    />

                </div>
            }}
        />

        <Modal
            open={edit}
            centered={false}
            size="tiny"
            closeIcon
            onClose={() => setEdit(false)}
            content={{
                content: <div className="position-relative">

                    <Header
                        as="h5"
                        content="Список фильтров для сайта"
                        className="mb-4"
                    />

                    {loadList && <div>
                        <span>&nbsp;</span>
                        <Dimmer active inverted><Loader /></Dimmer>
                    </div>}

                    {!loadList && error && <div className="text-danger text-center">
                        <strong>{error}</strong>
                    </div>}

                    {!loadList && !error && list.length === 0 && <div className="text-center">
                        <span className="opacity-50">Список пуст</span>
                    </div>}

                    {!loadList && !error && list.length > 0 && <List celled verticalAlign='middle'>

                        {list.map(row => <ListItem
                            key={row.id}
                            {...props}
                            row={row}
                        />)}

                    </List>}

                </div>,
            }}
        />

        <Dropdown
            trigger={<Button
                basic
                icon="filter"
                circular
                color={(
                    (typeof filterUtm == "object" && filterUtm.length > 0)
                    || (typeof filterRefferer == "object" && filterRefferer.length > 0)
                ) ? "green" : null
                }
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

                <Dropdown.Header>Refferer фильтр</Dropdown.Header>

                <Dropdown.Divider className="my-0" />

                {filtersRefferer.length === 0 && <div className="text-center px-3 my-2">
                    <small>Список пуст</small>
                </div>}

                {filtersRefferer.map((row, i) => <Dropdown.Item
                    key={i}
                    content={row}
                    icon={{
                        color: filterRefferer.indexOf(row) >= 0 ? "green" : null,
                        name: "world",
                    }}
                    onClick={() => handleFilterUtm(null, row)}
                    disabled={load}
                />)}

                <Dropdown.Divider className="my-0" />

                <Dropdown.Item>
                    <Checkbox
                        onChange={() => handleFilterUtm("hiden_only_e567475d1390851db6764e838dc76185")}
                        value="hiden_only_e567475d1390851db6764e838dc76185"
                        checked={filterUtm.indexOf("hiden_only_e567475d1390851db6764e838dc76185") >= 0}
                        label="Только скрытые IP"
                    />
                </Dropdown.Item>

                <Dropdown.Divider className="my-0" />

                <Dropdown.Item
                    icon="plus"
                    text="Добавить фильтр"
                    onClick={() => setAdd(true)}
                />
                <Dropdown.Item
                    icon="pencil"
                    text="Изменить список"
                    onClick={() => setEdit(true)}
                />

            </Dropdown.Menu>
        </Dropdown>
    </>
}

const ListItem = props => {

    const { row, setFilters, setFiltersRefferer } = props;
    const { filterUtm, filterRefferer, handleFilterUtm } = props;
    const [drop, setDrop] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    React.useEffect(() => {

        if (drop) {
            axios.delete('dev/block/allstatistics/droputm', { params: { id: drop } })
                .then(({ data }) => {

                    if (Boolean(data.row.utm_label)) {
                        setFilters(p => {
                            let rows = [...p],
                                fund = p.indexOf(data.row.utm_label);

                            if (fund >= 0) rows.splice(fund, 1);

                            return rows;
                        });

                        let fund = filterUtm.indexOf(data.row.utm_label);
                        if (fund >= 0) handleFilterUtm(data.row.utm_label);
                    }

                    if (Boolean(data.row.refferer_label)) {
                        setFiltersRefferer(p => {
                            let rows = [...p],
                                fund = p.indexOf(data.row.refferer_label);

                            if (fund >= 0) rows.splice(fund, 1);

                            return rows;
                        });

                        let fund = filterRefferer.indexOf(data.row.refferer_label);
                        if (fund >= 0) handleFilterUtm(null, data.row.refferer_label);
                    }

                    setDeleted(true);
                })
                .catch(e => axios.toast(e))
                .then(() => setDrop(false));
        }

    }, [drop]);

    const utm = Boolean(row.utm_label);
    const ref = Boolean(row.refferer_label);

    return <List.Item className="position-relative" disabled={deleted}>

        {!deleted && <List.Content floated="right">
            <Icon
                name="trash"
                className="my-2"
                link={!Boolean(drop)}
                color="red"
                onClick={() => setDrop(row.id)}
                disabled={Boolean(drop)}
            />
        </List.Content>}

        <List.Content>
            <div className="my-2 px-2">
                {utm && <div>
                    <Label empty circular color="yellow" size="mini" className="mr-2" />
                    <span>{row.utm_label}</span>
                </div>}
                {ref && <div>
                    <Icon name="world" color="green" />
                    <span>{row.refferer_label}</span>
                </div>}
            </div>
        </List.Content>

        {drop && <Dimmer active inverted>
            <Loader size="small" />
        </Dimmer>}

    </List.Item>

}

export default DropdownFilter;