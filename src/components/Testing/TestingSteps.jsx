import React from "react";
import { Label } from "semantic-ui-react";

const TestingSteps = ({ process }) => {

    return <div className="text-center mb-3">

        {process.questions_id && process.questions_id.map(row => {

            const props = {};
            const question = process.answer_process?.questions && process.answer_process.questions[row] || {};

            if (question)
                props.color = "blue";

            if (question.bad === true)
                props.color = "red";
            else if (question.bad === false)
                props.color = "green";

            if (process.answer_process?.question === row)
                props.color = "violet";

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