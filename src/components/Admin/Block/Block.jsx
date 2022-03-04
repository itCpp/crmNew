import React from "react";
import axios from "./../../../utils/axios-header";
import "./block.css";
import StatisticDay from "./Statistic/StatisticDay";
import StatisticIp from "./Statistic/StatisticIp";
import BlockDrive from "./BlockDrive";
import Views from "./Views";
import SitesStats from "./Sites/SitesStats";
import AddBlockAdId from "./AddBlockAdId";
import AllStatistic from "./Statistic/AllStatistics";
import { BlockDriveIp, BlockDriveHost } from "./Drive";

export const setBlockIp = async (formdata, done, error) => {

    await axios.post('dev/block/setBlockIp', formdata)
        .then(({ data }) => {
            typeof done == "function" && done(data)
        }).catch(e => {
            typeof error == "function" && error(e);
        });

}

const Block = props => {

    let body = null;
    const page = props.match?.params?.type || "statistic";

    const [addBlockId, setAddBlockId] = React.useState(null);
    const [update, setUpdate] = React.useState(null);

    if (page === "ip") {
        body = <StatisticIp {...props} />;
    }
    else if (page === "drive") {
        body = <BlockDrive
            {...props}
            setAddBlockId={setAddBlockId}
            updateRow={update}
        />;
    }
    else if (page === "driveip") {
        body = <BlockDriveIp {...props} />;
    }
    else if (page === "drivehost") {
        body = <BlockDriveHost {...props} />;
    }
    else if (page === "views") {
        body = <Views {...props} />;
    }
    else if (page === "sites") {
        body = <SitesStats
            {...props}
            setAddBlockId={setAddBlockId}
            updateRow={update}
        />;
    }
    else if (page === "allStatistic") {
        body = <AllStatistic {...props} />
    }
    else {
        body = <StatisticDay
            {...props}
            setBlockIp={setBlockIp}
            setAddBlockId={setAddBlockId}
            updateRow={update}
        />
    }

    return <>

        <AddBlockAdId
            open={addBlockId ? true : false}
            setOpen={setAddBlockId}
            row={addBlockId || {}}
            updateRow={setUpdate}
        />

        {body}

    </>

}

export default Block;