import { memo, useEffect, useCallback, useRef } from "react";
import { Button, Icon } from "semantic-ui-react";
import "./BtnScrollTop.css";

const BtnScrollTop = memo(props => {

    const btn = useRef();
    const rootElement = document.documentElement;

    const scrollToTop = useCallback(() => {
        rootElement && rootElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, []);

    const handleScroll = useCallback(() => {
        if (rootElement.scrollTop > 500) {
            btn.current && btn.current.classList.add("showBtn");
        } else {
            btn.current && btn.current.classList.remove("showBtn");
        }
    }, []);

    useEffect(() => {

        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('scroll', handleScroll);
        }

    }, []);

    return <button
        className="btn-scrolll-top"
        onClick={scrollToTop}
        ref={btn}
        children={<Icon name="chevron up" className="mr-0" />}
    />

});

export default BtnScrollTop;