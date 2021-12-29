export default (() => {

    const closeMode = e => {
        e.preventDefault();
        localStorage.removeItem('god-mode-id');
        window.location.href = e.target.href;
    }

    if (!localStorage.getItem('god-mode-id'))
        return null;

    return <div className="god-mode-global-off">
        <a className="text-link" href={window.location.href} onClick={closeMode}><b>Отключить</b></a> режим демонстрации разработчика
    </div>

});