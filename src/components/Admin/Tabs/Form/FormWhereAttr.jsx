import AttrWhere from "./AttrWhere";
import AttrWhereBetween from "./AttrWhereBetween";
import AttrWhereIn from "./AttrWhereIn";
import AttrWhereNull from "./AttrWhereNull";
import AttrWhereDatetime from "./AttrWhereDatetime";
import AttrWhereColumn from "./AttrWhereColumn";

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
        case "whereNull":
        case "whereNotNull":
            return <AttrWhereNull {...props} />
        case "whereDate":
        case "whereMonth":
        case "whereDay":
        case "whereYear":
        case "whereTime":
            return <AttrWhereDatetime {...props} />
        case "whereColumn":
            return <AttrWhereColumn {...props} />

        default:
            return null;

    }

}