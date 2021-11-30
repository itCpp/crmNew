import axios from "./../../../utils/axios-header";
import StatisticDay from "./Statistic/StatisticDay";

import "./block.css";

export const setBlockIp = async (formdata, done, error) => {

    await axios.post('dev/block/setBlockIp', formdata)
        .then(({ data }) => {
            typeof done == "function" && done(data)
        }).catch(e => {
            typeof error == "function" && error(e);
        });

}

const Block = props => {

    const page = props.match?.params?.type || "statistic";

    switch (page) {
        case "list":
            return null;
        default:
            return <StatisticDay {...props} setBlockIp={setBlockIp} />
    }

}

export default Block;