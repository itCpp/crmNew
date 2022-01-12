import React from "react";
import { Label } from "semantic-ui-react";

const TestingSteps = ({ process }) => {

    return <div className="text-center mb-3">

        {process.questions_id && process.questions_id.map(row => {

            const props = {};
            const question = process.answer_process?.questions && process.answer_process.questions[row] || null;

            if (question)
                props.color = "blue";

            if (process.done_at && question && question.bad === true)
                props.color = "red";
            else if (process.done_at && question && question.bad === false)
                props.color = "green";

            if (process.answer_process?.question === row)
                props.color = "green";

            return <Label
                key={row}
                circular
                empty
                {...props}
            />
        })}

    </div>

}

export default TestingSteps;