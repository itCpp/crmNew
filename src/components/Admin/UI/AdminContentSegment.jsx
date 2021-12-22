export default (props => {

    let className = ["admin-content-segment"];
    props.className && className.push(props.className);

    return <div className={className.join(' ')}>
        {props.children}
    </div>

});