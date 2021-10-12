import React from "react";

export const useObserver = (elem, canLoad, isLoading, callback) => {

    const observer = React.useRef();

    React.useEffect(() => {

        if (isLoading || !elem.current || canLoad) return;
        if (observer.current) observer.current.disconnect();

        const cb = entries => {

            if (typeof callback == "function" && entries[0].isIntersecting) {
                callback(entries, observer);
            }
        };

        observer.current = new IntersectionObserver(cb);
        observer.current.observe(elem.current);

    }, [isLoading]);

}