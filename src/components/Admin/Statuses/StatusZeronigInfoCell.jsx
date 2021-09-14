function StatusZeronigInfoCell(props) {

    const { zeroing, data } = props;

    if (zeroing === 0)
        return null;

    return <div>
        Обнуление
    </div>

}

export default StatusZeronigInfoCell;
