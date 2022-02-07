import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Header, Loader, Message, Statistic } from "semantic-ui-react";
import { axios } from "../../../utils";
import { TESTING_URL } from "../../Testing";
import { Segment } from "../UI"

const MyTests = props => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {

        axios.post('users/mytests').then(({ data }) => {
            setError(null);
            setRows(data.rows);
            setData(data);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="py-3 px-3 w-100" style={{ maxWidth: 600 }}>

        <Segment>

            <Header
                as="h2"
                content="Мои тестирования"
                className="mb-5"
            />

            {loading && <Loader inline="centered" active />}

            {!loading && error && <Message error content={error} size="mini" />}

            {!loading && !error && rows && rows.length === 0 &&
                <div className="my-5 opacity-50 text-center">Тестов еще нет</div>
            }

            {!loading && !error && rows.length > 0 && <div>

                <div className="mb-4 text-center">

                    <Statistic
                        value={data.count_done}
                        label="Заврешено"
                    />

                    <Statistic
                        value={data.count_new}
                        label="Необходимо решить"
                    />

                </div>

                {rows.map(row => {

                    let button_text = "Перейти к тесту",
                        button_color = "green";

                    if (row.start_at && row.done_at === null) {
                        button_text = "Продолжить тест";
                        button_color = "red";
                    } else if (row.start_at === null && row.done_at === null) {
                        button_text = "Начать тест";
                        button_color = "orange";
                    }

                    return <div key={row.uuid} className="mt-5">

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Header as="h4" className="m-0">Тест #{row.id}</Header>
                            <span className="opacity-70">{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</span>
                        </div>

                        <div className="mx-4 mb-2">

                            <div className="d-flex justify-content-between align-items-center">
                                <span>Количество вопросов</span>
                                <b>{typeof row.questions_id == "object" && row.questions_id.length}</b>
                            </div>

                            {row.done_at && <div className="d-flex justify-content-between align-items-center">
                                <span>Правильных ответов</span>
                                <b className="text-success">{row.answer_process?.correct || 0}</b>
                            </div>}

                            {row.done_at && <div className="d-flex justify-content-between align-items-center">
                                <span>Ответы с ошибкой</span>
                                <b className="text-danger">{row.answer_process?.incorrect || 0}</b>
                            </div>}

                            {row.start_at && <div className="d-flex justify-content-between align-items-center">
                                <span>Дата начала</span>
                                <b>{moment(row.start_at).format("DD.MM.YYYY HH:mm")}</b>
                            </div>}

                            {row.done_at && <div className="d-flex justify-content-between align-items-center">
                                <span>Дата окончания</span>
                                <b>{moment(row.done_at).format("DD.MM.YYYY HH:mm")}</b>
                            </div>}

                        </div>

                        <Button
                            content={button_text}
                            color={button_color}
                            onClick={() => props.history.push(`${TESTING_URL}?uuid=${row.uuid}`)}
                            fluid
                            size="tiny"
                        />

                    </div>
                })}

            </div>}

        </Segment>

    </div>

}

export default MyTests;