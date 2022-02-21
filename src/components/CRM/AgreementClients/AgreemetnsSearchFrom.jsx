import React from "react";
import { Button, Dropdown, Form, Header, Label } from "semantic-ui-react";

const AgreemetnsSearchFrom = props => {

    const { loading, load, search, setSearch } = props;
    const [open, setOpen] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});

    const close = () => setOpen(false);

    React.useEffect(() => {
        if (open) document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [open]);

    React.useEffect(() => {
        if ((loading || load) && open) setOpen(false);
    }, [loading, load])

    return <Dropdown
        disabled={loading || load}
        trigger={<>
            <Button
                icon="search"
                basic
                className="ml-0"
                onClick={() => setOpen(o => !o)}
                circular
            />
            {search && <Label
                circular
                empty
                color="orange"
                size="mini"
                style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    zIndex: 10,
                }}
            />}
        </>}
        icon={null}
        open={open}
        direction="left"
        className="mr-2"
    >
        <Dropdown.Menu>

            <Header as="h5" content="Поиск" />

            <Form className="mx-2 my-3">
                <Form.Input
                    placeholder="Номер договора"
                    className="mb-2"
                    icon="file text"
                    iconPosition="left"
                    name="number"
                    value={formdata.number || ""}
                    onChange={(e, { name, value }) => setFormdata(d => ({ ...d, [name]: value }))}
                />
                <Form.Input
                    placeholder="ФИО"
                    className="mb-2"
                    icon="user"
                    iconPosition="left"
                    name="name"
                    value={formdata.name || ""}
                    onChange={(e, { name, value }) => setFormdata(d => ({ ...d, [name]: value }))}
                />
                <Form.Input
                    placeholder="PIN юриста"
                    className="mb-2"
                    icon="law"
                    iconPosition="left"
                    name="pin"
                    value={formdata.pin || ""}
                    onChange={(e, { name, value }) => setFormdata(d => ({ ...d, [name]: value }))}
                />
                <Form.Input
                    placeholder="Дата"
                    className="mb-3"
                    icon="calendar"
                    iconPosition="left"
                    type="date"
                    name="date"
                    value={formdata.date || ""}
                    onChange={(e, { name, value }) => setFormdata(d => ({ ...d, [name]: value }))}
                />

                <Button
                    content="Найти"
                    fluid
                    color="green"
                    onClick={() => setSearch(formdata)}
                />

                {search && <Button
                    content="Отменить поиск"
                    fluid
                    color="orange"
                    className="mt-2"
                    onClick={() => {
                        setFormdata({});
                        setSearch(false);
                    }}
                />}
            </Form>
        </Dropdown.Menu>
    </Dropdown>

}

export default AgreemetnsSearchFrom;