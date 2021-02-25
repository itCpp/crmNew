import { Select } from 'semantic-ui-react'

export default function Sites(props) {

    const options = [];

    props.sites.forEach(site => {
        options.push({
            key: site,
            text: site,
            value: site,
            onClick: () => props.setSite(site),
        });
    });

    return <Select
        fluid
        options={options}
        label="Выберите сайт"
        placeholder="Выберите сайт"
        value={props.site}
        className="mb-2"
        disabled={props.errorSites || !props.sites.length ? true : false}
        error={props.errorSites ? true : false}
        loading={props.loadingData ? true : false}
    />

}