import React from "react";
import axios from "./../../../../utils/axios-header";

import { Header, Message, Loader, Placeholder, Icon, Button } from "semantic-ui-react";

import TabBasicSettings from "./TabBasicSettings";
import TabQuerySettings from "./TabQuerySettings";
import TabPermitsSettings from "./TabPermitsSettings";
import TabSortSettings from "./TabSortSettings";
import TabStatusesRows from "./TabStatusesRows";

export default function Tab(props) {

    const { tab, tabs, setTabs } = props;

    const header = React.useRef();

    const [row, setRow] = React.useState(tabs.find(i => i.id === tab));
    const [formdata, setFormdata] = React.useState({});

    const [columns, setColumns] = React.useState([]);
    const [statuses, setStatuses] = React.useState([]);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});

    const noChange = JSON.stringify({ ...row, updated_at: null }) === JSON.stringify({ ...formdata, updated_at: null });

    const onChange = (...a) => {
        const e = a[1] || a[0].currentTarget;
        const value = e.type === "checkbox"
            ? e.checked ? 1 : 0
            : e.value;
        setFormdata(data => ({ ...data, [e.name]: value }));
    }

    React.useEffect(() => {

        if (tab) {

            setLoading(true);

            axios.post('dev/getTab', {
                id: tab,
                getColumns: true,
                getStatuses: true,
            }).then(({ data }) => {

                tabs.find((r, k, a) => {
                    if (r.id === tab) {
                        a[k] = data.tab;
                        setTabs(a);
                        return true;
                    }
                });

                setRow(data.tab);
                setFormdata(data.tab);

                setColumns(data.columns);
                setStatuses(data.statuses);
                setError(null);

                if (header.current) {
                    header.current.style.top = header.current.getBoundingClientRect().top + 'px';
                }

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [tab]);

    React.useEffect(() => {

        if (save) {
            axios.post('dev/tabs/save', formdata).then(({ data }) => {
                setRow(data.tab);
                setSaveError(null);
                setSaveErrors({});
            }).catch(e => {
                axios.toast(e, { time: 15000 });
                setSaveError(axios.getError(e));
                setSaveErrors(axios.getErrors(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center" ref={header} style={{ position: "sticky", zIndex: 100 }}>

            <div className="hidden-sticky" />

            <div className="flex-grow-1">

                <div className="d-flex align-items-center">
                    <Icon
                        name="arrow left"
                        size="big"
                        className="button-icon"
                        style={{ marginRight: "1rem" }}
                        title="Назад"
                        onClick={() => props.history.goBack()}
                    />
                    <Header
                        as="h2"
                        content={`Вкладка: ${row?.name || ""}`}
                        subheader={row?.name_title || ""}
                    />
                </div>

            </div>

            {loading && <div><Loader active inline /></div>}

            {!loading && <div>
                <Button
                    icon="save"
                    color="green"
                    circular
                    basic={noChange}
                    className="mx-2"
                    title="Сохранить"
                    disabled={noChange || save}
                    loading={save}
                    onClick={() => setSave(true)}
                />
            </div>}

        </div>

        {error && !loading && <Message error content={error} />}

        {!error && !loading && <div className="d-flex justify-content-start align-items-start flex-segments">

            <div className="d-flex justifycontent-start flex-column flex-segments w-100">

                <TabBasicSettings
                    row={formdata}
                    statuses={statuses}
                    setFormdata={onChange}
                    loading={save}
                    error={error}
                    errors={saveErrors}
                />

                <TabQuerySettings
                    tab={row}
                    tabs={tabs}
                    setTabs={setTabs}
                    setTab={setRow}
                    columns={columns}
                />

                <TabSortSettings
                    tab={row}
                    tabs={tabs}
                    setTabs={setTabs}
                    setTab={setRow}
                    columns={columns}
                />

            </div>

            <div className="d-flex justifycontent-start flex-column flex-segments w-100">

                <TabPermitsSettings
                    tab={row}
                    tabs={tabs}
                    setTabs={setTabs}
                    setTab={setRow}

                    row={formdata}
                    setFormdata={onChange}
                    loading={save}
                    error={error}
                    errors={saveErrors}
                />

                <div className="admin-content-segment w-100">

                    <div className="divider-header">
                        <h3>Информация о колонках</h3>
                    </div>

                    {columns.map(column => <div key={column.name} className="column-table-info">
                        <code className="code-row" title="Наименование колонки">{column.name}</code>
                        <div className="code-row code-row-blue" title="Тип колонки">{column.type}</div>
                        <small>{column.comment}</small>
                    </div>)}

                </div>

            </div>

        </div>}

    </>

}