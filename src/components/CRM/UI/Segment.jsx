import { Header, Loader } from "semantic-ui-react";
import './ui.css';

export default (props => {

    const { loading } = props;
    const { header, className } = props;
    const style = props.style || {};

    let classNames = ["segmend-card"];
    className && classNames.push(className);

    if (props.height)
        style.height = props.height;

    return <div className={classNames.join(' ')} style={style}>

        {typeof header == "object" && <Header {...header} />}

        {!loading && props.children}
        {loading && <Loader active inline="centered" className="my-2" />}

    </div>

});