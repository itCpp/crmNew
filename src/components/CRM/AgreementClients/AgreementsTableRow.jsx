import React from "react";
import { Icon, Table, Image, Popup } from "semantic-ui-react";
import moment from "moment";

const PhoneRow = props => {

    const { phone, number } = props;
    const block = React.useRef();

    const copyPhone = React.useCallback((phone) => {
        if (block.current) {

            // navigator clipboard api needs a secure context (https)
            if (navigator.clipboard && window.isSecureContext) {
                // navigator clipboard api method'
                navigator.clipboard.writeText(phone);
            } else {
                // text area method
                let textArea = document.createElement("textarea");
                textArea.value = phone;
                // make the textarea out of viewport
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                new Promise((res, rej) => {
                    // here the magic happens
                    document.execCommand('copy') ? res() : rej();
                    textArea.remove();
                });
            }

            block.current.classList.add('copyed');
            setTimeout(() => block.current.classList.remove('copyed'), 100);
        }
    }, []);

    return <div onClick={() => copyPhone(number)} className="d-flex align-items-center">
        <div>
            <Icon name="copy" className="button-icon" title="Скопировать номер телефона" />
        </div>
        <div className="to-copy-text text-nowrap" ref={block}>{phone}</div>
    </div>

}

const AgreementsTableRow = props => {

    const { loading, row, setShowEdit } = props;

    const className = ["clients-agree-row"];

    if (row.color)
        className.push(row.color);

    return <Table.Row verticalAlign="top" disabled={loading} className={className.join(' ')}>

        <Table.Cell className="px-2">

            <div className="d-flex align-items-center">
                {row.icon && <Image
                    src={row.icon}
                    width={16}
                    height={16}
                    rounded
                    className="mr-2"
                    disabled={loading}
                />}
                <div className="text-nowrap">
                    <span>№<strong>{row.nomerDogovora}</strong></span>
                    <small> от {moment(row.date).format("DD.MM.YYYY")}</small>
                </div>
            </div>

            {row.tematika && <div>{row.tematika}</div>}

            {row.unicIdClient > 0 && <div className="mt-2" title="Номер заявки">#<strong>{row.unicIdClient}</strong></div>}

            {row.coming_date && <div title="Дата и время прихода" className="mt-2 text-nowrap">
                <div className="d-flex align-items-center">
                    <span><Icon name="child" /></span>
                    <span>{moment(row.coming_date).format("DD.MM.YYYY")}</span>
                </div>
                <div className="d-flex align-items-center">
                    <span><Icon name="clock" /></span>
                    <span>{row.coming_time}</span>
                </div>
            </div>}

        </Table.Cell>

        <Table.Cell className="px-2">
            <div>{row.FullNameClient}</div>

            {typeof row.phones == "object" && row.phones.length > 0 && <div className="mt-3">
                {row.phones.map((phone, i) => <PhoneRow
                    {...phone}
                    key={`${phone.number}${row.id}${i}`}
                />)}
            </div>}
        </Table.Cell>

        <Table.Cell className="px-2">

            {row.oristFioArr && row.oristFioArr.length > 0 && row.oristFioArr.map(upp => <Popup
                key={`lawyer_upp_${upp.pin}_${row.id}`}
                content={upp.fio}
                size="mini"
                inverted
                trigger={<div className="d-flex text-nowrap">
                    <span>ЮПП</span>
                    <strong className="ml-2">{upp.pin}</strong>
                </div>}
            />)}

            {row.odIspolnitel && <Popup
                content={row.odIspolnitel.fio}
                size="mini"
                inverted
                trigger={<div className="d-flex text-nowrap">
                    <span>Предст.</span>
                    <strong className="ml-2">{row.odIspolnitel.pin}</strong>
                </div>}
            />}

        </Table.Cell>

        <Table.Cell className="px-2">
            {row.comments?.act && row.comments.act.length > 0 && <div>
                {row.comments.act.map(act => <div key={`act_${act.id}`} style={{ fontSize: "0.8rem" }} className="text-nowrap">
                    <span>{act?.text?.type}</span>
                    {act?.text?.date && <span className="opacity-70">{' '}{act.text.date}</span>}
                    {act?.text?.money && <strong>{' '}{act.text.money}</strong>}
                </div>)}
            </div>}
        </Table.Cell>

        <Table.Cell className="px-2">

            <div className="text-nowrap">
                <span>Сумма</span>
                <strong>{' '}{(row.summa || 0) - (row.predstavRashod || 0)}</strong>
            </div>

            {row.predstavRashod > 0 && <div className="text-nowrap">
                <span>ПР+Бонус</span>
                <strong>{' '}{row.predstavRashod || 0}</strong>
            </div>}

            <div className="text-nowrap">
                <span>Аванс</span>
                <strong>{' '}{row.avans || 0}</strong>
            </div>

            {row.predstavRashodJson && row.predstavRashodJson.length > 0 && <div className="mt-2">
                {row.predstavRashodJson.map(rash => <div key={`rash_${rash.id}`} style={{ fontSize: "0.8rem" }} className="text-nowrap">
                    <span>{rash?.name}</span>
                    {rash?.money && <span className="opacity-70">{' '}{rash.money}</span>}
                    {rash?.status === "true" && <strong>{' '}оплач</strong>}
                </div>)}
            </div>}

        </Table.Cell>

        <Table.Cell className="px-2">
            {typeof row.comments == "object" && <CellComments
                row={row}
                rows={row.comments}
            />}
        </Table.Cell>

        <Table.Cell className="px-2">
            {row.predmetDogovora && <small>{row.predmetDogovora}</small>}
        </Table.Cell>

        <Table.Cell className="px-2">
            {typeof row.collComments == "object" && row.collComments.map((comment, i) => <div key={`${row.id}_comment_coll_${i}`} style={{ fontSize: "0.8rem", lineHeight: "1rem" }} className="mt-1">
                <Popup
                    content={comment?.author?.fio}
                    trigger={<strong>{comment?.author?.pin}</strong>}
                    size="mini"
                    inverted
                />
                <span className="opacity-60">{' '}{moment(comment.created_at).format("DD.MM.YYYY в HH:mm")}</span>
                <span>{' '}{comment.comment}</span>
            </div>)}
            {typeof row.collComments != "object" && row.comment}
        </Table.Cell>

        <Table.Cell className="px-2">
            <div className="d-flex justify-content-center align-items-center">
                <span className="mx-1">
                    <Icon
                        name="edit"
                        fitted
                        link
                        title="Изменить статус"
                        onClick={() => setShowEdit(row)}
                    />
                </span>
            </div>
        </Table.Cell>

    </Table.Row>

}

const CellComments = props => {

    const { row, rows } = props;
    const comments = [];

    for (let type in rows)
        comments.push(<CellCommentsType rows={rows[type]} type={type} id={row.id} />);

    return comments.map((b, i) => <div key={`${row.id}_${i}_comments`}>{b}</div>);

}

const CellCommentsType = props => {

    const { type, rows, id } = props;
    let name = "Комментарии";

    if (type === "act"
        || type === "predmetDogovora"
        || type === "odIspolnitel"
        || rows.length === 0
    ) return null;

    if (type === 'comment') name = "Комментарии";
    else if (type === 'commentOKK') name = "Комментарии ОКК";
    else if (type === 'epodComments') name = "Комментарии ЭПОД";
    else if (type === 'nachPredComment') name = "Комментарии рук. ОКК";
    else if (type === 'sytRazgovora') name = "Суть разговора с клиентом";
    else if (type === 'uppComment') name = "Комментарии ЮПП";
    else if (type === 'clientComment') name = "Комментарии клиента";

    return <div className="mb-2">

        <div><strong>{name}:</strong></div>

        {rows.map((comment, i) => <div key={`${id}_comment_${type}_${i}`} style={{ fontSize: "0.8rem", lineHeight: "1rem" }} className="mt-1">
            <Popup
                content={comment?.author?.fio}
                trigger={<strong>{comment?.author?.pin}</strong>}
                size="mini"
                inverted
            />
            <span className="opacity-60">{' '}{moment(comment.created_at).format("DD.MM.YYYY в HH:mm")}</span>
            <span>{' '}{comment.text}</span>
        </div>)}

    </div>;

}

export default AgreementsTableRow;