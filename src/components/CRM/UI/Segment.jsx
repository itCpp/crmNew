import { Header, Loader } from "semantic-ui-react";
import './ui.css';

export default (props => {

    const { loading } = props;
    const { header, className } = props;

    let classNames = ["segmend-card"];
    className && classNames.push(className);

    return <div className={classNames.join(' ')} style={{ ...(props.style || {}) }}>

        {typeof header == "object" && <Header {...header} />}

        {!loading && props.children}
        {loading && <Loader active inline="centered" className="my-2" />}

    </div>

});