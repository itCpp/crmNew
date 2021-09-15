import AttrWhere from "./AttrWhere";
import AttrWhereBetween from "./AttrWhereBetween";

export default function FormWhereAttr(props) {

    const { query } = props;

    switch (query.where) {

        case "where":
        case "orWhere":
            return <AttrWhere {...props} />
        case "whereBetween":
        case "whereNotBetween":
            return <AttrWhereBetween {...props} />

        default:
            return null;

    }

}