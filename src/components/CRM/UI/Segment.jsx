import { Header, Loader } from "semantic-ui-react";

export default (props => {

    const { loading } = props;
    const { header, className } = props;

    let classNames = ["block-card"];
    className && classNames.push(className);

    return <div className={classNames.join(' ')}>

        {typeof header == "object" && <Header {...header} />}

        {!loading && props.children}
        {loading && <Loader active inline="centered" className="my-2" />}

    </div>

});