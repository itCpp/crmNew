import React from "react";
import { axios } from "../../utils";
import { Button } from "semantic-ui-react";
import moment from "moment";

const TestingStart = props => {

    const { process, setProcess, setQuestion } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const testingStart = () => {

        setLoading(true);

        axios.post('testing/start', {
            uuid: process.uuid,
        }).then(({ data }) => {
            setProcess(data.process);
            setQuestion(data.question);
        }).catch(e => {
            setError(axios.getError(e));
            setLoading(false);
        });

    }

    return <div className="testing-segment mx-auto" style={{ maxWidth: 400 }}>

        <div className="mb-3">
            <span>Здравствуйте</span>!
            {process?.user?.name && <span>, {process.user.name}<strong></strong></span>}
            <div>Для начала тестирования нажмите кнопку <b className="text-success">Начать</b></div>
        </div>

        <div className="d-flex justify-content-between mb-1">
            <span>Дата создания</span>
            <strong>{moment(process.created_at).format("DD.MM.YYYY в HH:mm")}</strong>
        </div>
        <div className="d-flex justify-content-between mb-1">
            <span>Количество вопросов</span>
            <strong>{process.questions_id.length}</strong>
        </div>

        <Button
            color={error ? "red" : "green"}
            className="mx-auto mt-3"
            loading={loading}
            disabled={loading}
            content="Начать"
            fluid
            onClick={testingStart}
        />
        
        {error && <div className="text-danger mt-2"><b>Ошибка</b>: {error}</div>}

    </div>

}

export default TestingStart;