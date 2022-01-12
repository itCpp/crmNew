import moment from "moment";
import { TestingQuestionRow } from "./TestingQuestion";
import { secToDate } from "./../../utils/date";

const TestingResult = props => {

    const { process, questions } = props;

    return <>

        <div className="testing-segment mx-auto" style={{ maxWidth: 400 }}>

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
                <strong>{secToDate(moment(process.done_at).diff(moment(process.start_at), "seconds"))}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Правильныйх ответов</span>
                <strong className="text-success">{process.answer_process?.correct || 0}</strong>
            </div>
            <div className="d-flex justify-content-between mb-1">
                <span>Неправильныйх ответов</span>
                <strong className="text-danger">{process.answer_process?.incorrect || 0}</strong>
            </div>

        </div>

        {(process.questions_id || []).map((row, i) => {

            let question = questions[row] || null;

            if (!question || question.bad === false)
                return null;

            return <TestingQuestionRow key={row}
                number={i + 1}
                question={question}
                answers={question.answers_selected || []}
                result
            />

        })}

    </>

}

export default TestingResult;