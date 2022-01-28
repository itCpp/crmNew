import axios from "./../../../utils/axios-header";
import StatisticDay from "./Statistic/StatisticDay";
import StatisticIp from "./Statistic/StatisticIp";
import BlockDrive from "./BlockDrive";
import Views from "./Views";
import SitesStats from "./Sites/SitesStats";
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
        case "ip":
            return <StatisticIp {...props} />;
        case "drive":
            return <BlockDrive {...props} />;
        case "views":
            return <Views {...props} />;
            case "sites":
            return <SitesStats {...props} />;
        default:
            return <StatisticDay {...props} setBlockIp={setBlockIp} />
    }

}

export default Block;