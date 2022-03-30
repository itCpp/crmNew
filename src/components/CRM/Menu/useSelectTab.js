import React from "react";

const useSelectTab = props => {

    const [tab, setTab] = React.useState(localStorage.getItem('select_tab') ? Number(localStorage.getItem('select_tab')) : null);
    const [updateTab, setUpdateTab] = React.useState(false);

    console.log({ tab, updateTab });

    return {
        tab,
        setTab,
        updateTab,
        setUpdateTab,
    };

}

export default useSelectTab;