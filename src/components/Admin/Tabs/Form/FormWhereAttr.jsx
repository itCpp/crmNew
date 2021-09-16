import AttrWhere from "./AttrWhere";
import AttrWhereBetween from "./AttrWhereBetween";
import AttrWhereIn from "./AttrWhereIn";

export default function FormWhereAttr(props) {

    const { query } = props;

    switch (query.where) {

        case "where":
        case "orWhere":
            return <AttrWhere {...props} />
        case "whereBetween":
        case "whereNotBetween":
            return <AttrWhereBetween {...props} />
        case "whereIn":
        case "whereNotIn":
            return <AttrWhereIn {...props} />

        default:
            return null;

    }

}