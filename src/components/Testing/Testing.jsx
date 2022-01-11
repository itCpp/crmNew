import React from "react";
import { axios } from "../../utils";
import { Header, Loader, Message } from "semantic-ui-react";
import moment from "moment";

import "./testing.css";
import TestingStart from "./TestingStart";
import TestingQuestion from "./TestingQuestion";
import TestingSteps from "./TestingSteps";

const Testing = () => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [process, setProcess] = React.useState({});
    const [question, setQuestion] = React.useState(null);

    React.useEffect(() => {

        var searchParams = new URLSearchParams(window.location?.search || "");
        setLoading(true);

        axios.post('testing/get', {
            uuid: searchParams.get('uuid'),
        }).then(({ data }) => {
            setError(null);
            setProcess(data.process);
            setQuestion(data.question);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="my-5 mx-auto w-100" style={{ maxWidth: 700 }}>

        <Header
            as="h1"
            content="Тестирование"
            className="text-center"
        />

        <TestingSteps process={process} />

        {loading && <Loader active inline="centered" />}

        {!loading && error && <Message content={error} error />}

        {!loading && <div></div>}

        {!loading && !error && !process.start_at && <TestingStart
            process={process}
            setProcess={setProcess}
            setQuestion={setQuestion}
        />}

        {!loading && !error && process.start_at && question && <TestingQuestion
            question={question}
            questions={process.questions_id}
            setQuestion={setQuestion}
            process={process}
            setProcess={setProcess}
        />}

        {!loading && !error && process.done_at && <div className="testing-segment mx-auto" style={{ maxWidth: 400 }}>

            <h5>Результаты тестирования</h5>

            <div className="d-flex justify-content-between mb-1">
                <span>Дата и время создания</span>
                <strong>{moment(process.created_at).format("DD.MM.YYYY в HH:mm")}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Количество вопросов</span>
                <strong>{process.questions_id.length}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Дата и время начала</span>
                <strong>{moment(process.start_at).format("DD.MM.YYYY в HH:mm")}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Дата и время окончания</span>
                <strong>{moment(process.done_at).format("DD.MM.YYYY в HH:mm")}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Время тестирования</span>
                <strong>--:--</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Правильныйх ответов</span>
                <strong className="text-success">{process.answer_process?.correct || 0}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Неправильныйх ответов</span>
                <strong className="text-danger">{process.answer_process?.incorrect || 0}</strong>
            </div>

        </div>}

    </div>

}

export default Testing;