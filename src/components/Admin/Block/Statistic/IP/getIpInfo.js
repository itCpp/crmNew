import axios from "./../../../../../utils/axios-header";

export const getIpInfo = async (ip, done = null) => {

    await axios.post('free/getIpInfo', { ip }).then(({ data }) => {
        if (typeof done == "function")
            done(data);
    }).catch(e => {
        axios.toast(e);
    });

}

export default getIpInfo;