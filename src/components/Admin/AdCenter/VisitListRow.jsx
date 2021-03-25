import React from 'react'

import VisitListRowItem from './VisitListRowItem'

function VisitListRow(props) {

    const [show, setShow] = React.useState(false);

    const row = props.row;

    const subRows = row.views.length
        ? row.views.map(sub => <VisitListRowItem key={sub.id} row={sub} type="subrow" show={show} />)
        : null

    return <>
        <VisitListRowItem row={row} type="row" show={show} setShow={setShow} />
        {subRows}
    </>

}

export default VisitListRow