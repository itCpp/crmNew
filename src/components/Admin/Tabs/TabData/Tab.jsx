import React from "react";
import axios from "./../../../../utils/axios-header";

import { Header, Message, Loader, Form, Icon } from "semantic-ui-react";

import TabBasicSettings from "./TabBasicSettings";
import TabQuerySettings from "./TabQuerySettings";

export default function Tab(props) {

    const { tab, tabs, setTabs } = props;
    const [row, setRow] = React.useState(tabs.find(i => i.id === tab));
    const [columns, setColumns] = React.useState([]);

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        if (tab) {

            setLoad(true);

            axios.post('dev/getTab', { id: tab, getColumns: true }).then(({ data }) => {

                tabs.find((r, k, a) => {
                    if (r.id === tab) {
                        a[k] = data.tab;
                        setTabs(a);
                        return true;
                    }
                });

                setRow(data.tab);
                setColumns(data.columns);
                setError(null);

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoad(false);
            });

        }

    }, [tab]);

    return <>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content={`Вкладка: ${row?.name || ""}`}
                subheader={row?.name_title || ""}
            />

        </div>

        {load
            ? <div><Loader active inline="centered" /></div>
            : null
        }

        {error && !load
            ? <Message error content={error} />
            : null
        }

        {!error && !load
            ? <div className="d-flex justify-content-start align-items-start flex-segments">

                <div className="d-flex justifycontent-start flex-column flex-segments w-100">

                    <TabBasicSettings
                        tab={row}
                        tabs={tabs}
                        setTabs={setTabs}
                        setTab={setRow}
                    />

                    <TabQuerySettings
                        tab={row}
                        tabs={tabs}
                        setTabs={setTabs}
                        setTab={setRow}
                        columns={columns}
                    />

                </div>



                <div className="admin-content-segment w-100">

                    <div className="divider-header">
                        <h3>Информация о колонках</h3>
                        <div>

                        </div>
                    </div>

                    {columns.map(column => <div key={column.name} className="column-table-info">
                        <code className="code-row" title="Наименование колонки">{column.name}</code>
                        <div className="code-row code-row-blue" title="Тип колонки">{column.type}</div>
                        <small>{column.comment}</small>
                    </div>)}

                </div>

            </div>
            : null
        }

    </>

}