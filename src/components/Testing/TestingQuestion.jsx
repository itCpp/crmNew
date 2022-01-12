import React from "react";
import { axios } from "../../utils";
import { Button, Checkbox } from "semantic-ui-react";

const TestingQuestion = props => {

    const { question, setQuestion } = props;
    const { questions, process, setProcess } = props;

    const [answers, setAnswers] = React.useState([]);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const onChange = (e, { checked, value }) => {

        let ans = [...answers];
        let index = ans.indexOf(value);

        if (checked && index < 0) {
            ans.push(value);
        } else if (!checked && index >= 0) {
            ans.splice(index, 1);
        }

        setAnswers(ans);

    }

    const nextQuestion = () => {

        setLoading(true);

        axios.post('testing/next', {
            uuid: process.uuid,
            answers,
            question: question.id,
        }).then(({ data }) => {

            setLoading(false);

            setAnswers([]);
            setError(null);

            setProcess(data.process);
            setQuestion(data.question);

        }).catch(e => {
            setLoading(false);
            setError(axios.getError(e));
        });

    }

    return <>

        <TestingQuestionRow
            question={question}
            answers={answers}
            onChange={onChange}
            nextQuestion={nextQuestion}
            loading={loading}
            error={error}
            number={questions.indexOf(question.id) + 1}
        />

        {error && <div className="text-danger mt-2"><b>Ошибка</b>: {error}</div>}

    </>

}

export const TestingQuestionRow = props => {

    const { number, question, answers } = props;
    const { loading, error } = props;
    const { onChange, nextQuestion } = props;
    const result = typeof props.result != "undefined";

    const classNames = ["testing-segment mx-auto mt-2"];

    if (result)
        classNames.push("bad-answers");

    return <div className={classNames.join(' ')}>

        <div className="mb-3">
            {number && <b style={{ color: "black" }}>{number}. </b>}
            <strong>{question.question}</strong>
        </div>

        <div className="testing-list-answers">
            {question.answers.map((row, i) => <div key={i} className="testing-list-answers-item">
                <Checkbox
                    label={row[1]}
                    value={row[0]}
                    onChange={onChange}
                    checked={(answers || []).indexOf(row[0]) >= 0}
                    disabled={loading || result}
                />
            </div>)}
        </div>

        {!result && <div className="text-right mt-5">
            <Button
                content="Дальше"
                onClick={nextQuestion}
                disabled={(answers || []).length === 0 || loading}
                loading={loading}
                color={error ? "red" : "green"}
            />
        </div>}

    </div>

}

export default TestingQuestion;