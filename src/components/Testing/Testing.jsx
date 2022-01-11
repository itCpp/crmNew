import React from "react";
import { axios } from "../../utils";
import { Header, Segment, Loader, Message } from "semantic-ui-react";

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

    </div>

}

export default Testing;