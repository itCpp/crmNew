export default (() => {

    const closeMode = e => {
        e.preventDefault();
        localStorage.removeItem('god-mode-id');
        window.location.href = e.target.href;
    }

    return <div className="god-mode-global-off">
        <a className="text-link" href={window.location.href} onClick={closeMode}><b>Отключить</b></a> режим демонстрации разработчика
    </div>

});