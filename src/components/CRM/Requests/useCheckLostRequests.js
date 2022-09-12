import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDropListRequest } from "../../../store/requests/actions";
import { axios } from "../../../utils";

let loading = false;

const useCheckLostRequests = props => {

    const { tabSettings } = props;
    const dispatch = useDispatch();
    const { id, check_lost_requests } = tabSettings;
    const interval = useRef();
    const requests = useSelector(state => state.requests.requests);

    const checkLostRequests = () => {

        if (loading) return;

        loading = true;

        let ids = requests.map(row => row.id);

        axios.post('requests/getlost', { id, list: ids })
            .then(({ data }) => {
                if (data.length > 0)
                    dispatch(setDropListRequest(data));
            })
            .catch(() => null)
            .then(() => {
                loading = false;
            });
    }

    useEffect(() => {

        if (Boolean(id) && Boolean(check_lost_requests)) {
            interval.current = setInterval(checkLostRequests, tabSettings.intervalTimer || 30000);
        }

        return () => {
            loading = false;
            interval.current && clearInterval(interval.current);
        }
    }, [id]);

    return {};
}

export default useCheckLostRequests;