import React from "react";
import Hooks from "./../../../hooks";
import { Table, Transition } from "semantic-ui-react";
import RequestsTableRow from "./RequestsTableRow";
import RequestEditCell from "./../RequestEditCell";
import RequestEdit from "./../RequestEdit";

const RequestsTable = props => {

    const { requests, getRequests } = props;
    const { paginate, loadPage, last } = props;

    const elem = React.useRef();
    const observer = React.useRef();

    React.useEffect(() => {

        if (loadPage || !elem.current) return;
        if (observer.current) observer.current.disconnect();

        const cb = entries => {

            if (entries[0].isIntersecting) {

                let page = (paginate.page + 1);

                if (page <= paginate.pages)
                    getRequests({ ...paginate, page });

            }

        };

        observer.current = new IntersectionObserver(cb);
        observer.current.observe(elem.current);

    }, [loadPage]);

    // Hooks.useObserver(elem, paginate.page === paginate.pages, { loadPage, last }, () => {
    //     let page = (paginate.page + 1);
    //     getRequests({ ...paginate, page });
    // });

    const [editCell, setEditCell] = React.useState(null);

    const setCell = (e, row) => setEditCell({
        id: row.id,
        type: e.currentTarget?.dataset ? e.currentTarget?.dataset.type : null,
        pageX: e.clientX,
        pageY: e.clientY,
        currentTarget: e.currentTarget,
    });

    const [edit, setEdit] = React.useState(null);

    return <>

        <Table basic="very" textAlign="left" compact className="mb-0">

            <Table.Header>
                <Table.Row id="requests-header-row">
                    <Table.HeaderCell>id</Table.HeaderCell>
                    <Table.HeaderCell>Дата</Table.HeaderCell>
                    <Table.HeaderCell>Оператор</Table.HeaderCell>
                    <Table.HeaderCell>Клиент</Table.HeaderCell>
                    <Table.HeaderCell>Тема</Table.HeaderCell>
                    <Table.HeaderCell>Комментарии</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Transition.Group
                as={Table.Body}
                duration={300}
                animation="fly right"
            >
                {requests.length
                    ? requests.map(row => <RequestsTableRow
                        key={row.id}
                        {...props}
                        row={row}
                        setCell={setCell}
                        setEdit={setEdit}
                        updates={props.updates}
                    />)
                    : <Table.Row>
                        <Table.Cell colSpan={7}>
                            <div className="text-center mt-5 mb-4 text-muted" style={{ opacity: 0.5 }}><strong>Данных нет</strong></div>
                        </Table.Cell>
                    </Table.Row>
                }
            </Transition.Group>

        </Table>

        {editCell?.id && <RequestEditCell {...props} editCell={editCell} setEditCell={setEditCell} />}
        {edit && <RequestEdit {...props} row={edit} setOpen={setEdit} />}

        <div ref={elem} className="loader-requests">
            {loadPage && <img src="/images/loader.gif" />}
        </div>

    </>

}

export default RequestsTable;