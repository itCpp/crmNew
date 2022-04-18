import { Header, Loader } from "semantic-ui-react";

export default (props => {

    const { loading } = props;
    const { header, className } = props;
    const { content } = props;

    let classNames = ["admin-content-segment"];
    className && classNames.push(className);

    return <div className={classNames.join(' ')}>

        {typeof header == "object" && <Header {...header} />}

        {!loading && !props.children && content}
        {!loading && props.children}
        {loading && <Loader active inline="centered" className="my-2" />}

    </div>

});