import AttrWhere from "./AttrWhere";

export default function FormWhereAttr(props) {

    const { query } = props;

    switch (query.where) {

        case "where":
        case "orWhere":
            return <AttrWhere {...props} />

        default:
            return null;

    }

}