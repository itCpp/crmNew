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
        <div className="testing-segment mx-auto">

            <div className="mb-3">
                <b style={{ color: "black" }}>{questions.indexOf(question.id) + 1}. </b>
                <strong>{question.question}</strong>
            </div>

            <div className="testing-list-answers">
                {question.answers.map((row, i) => <div key={i} className="testing-list-answers-item">
                    <Checkbox
                        label={row[1]}
                        value={row[0]}
                        onChange={onChange}
                        checked={answers.indexOf(row[0]) >= 0}
                        disabled={loading}
                    />
                </div>)}
            </div>

            <div className="text-right mt-5">
                <Button
                    content="Дальше"
                    onClick={nextQuestion}
                    disabled={answers.length === 0 || loading}
                    loading={loading}
                    color={error ? "red" : "green"}
                />
            </div>

        </div>

        {error && <div className="text-danger mt-2"><b>Ошибка</b>: {error}</div>}

    </>

}

export default TestingQuestion;