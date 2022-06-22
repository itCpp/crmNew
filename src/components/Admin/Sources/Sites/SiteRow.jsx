import React from "react";
import { GridColumn, Header, Icon, Loader, Image, Checkbox } from "semantic-ui-react";
// import html2canvas from "html2canvas";
import { axios } from "../../../../utils";

const SiteRow = props => {

    const { row, setRows, forCheck } = props;
    const block = React.useRef();
    const [image, setImage] = React.useState(null);
    const [check, setCheck] = React.useState(null);

    React.useEffect(() => {

        if (Boolean(row.check?.body)) {

            setImage(`http://mini.s-shot.ru/?https://${row.val}`);

            // var template = document.createElement('div');
            // let html = String(row.check?.body).trim();
            // template.innerHTML = html;
            // template.classList = "template-site";
            // template.style.position = "absolute";
            // template.style.left = "calc(100% + 100vw)";
            // template.style.top = "calc(100% + 100vh)";
            // template.style.width = "1366px";
            // template.style.height = "768px";
            // block.current.appendChild(template);

            // setTimeout(() => {
            //     html2canvas(template).then(canvas => {
            //         setImage(canvas.toDataURL("image/png"));
            //         let site = block.current.querySelector('div.template-site');
            //         site && site.remove();
            //     });
            // }, 300);
        }

    }, [row.check]);

    React.useEffect(() => {

        if (Boolean(check)) {

            console.log(12);

            axios.post('dev/resource/site/check', check)
                .then(({ data }) => {
                    setRows(prev => {
                        const rows = [...prev];
                        rows.forEach((row, i) => {
                            if (row.id === data.row.id) {
                                rows[i] = { ...row, check_site: data.row.check_site }
                            }
                        });
                        return rows;
                    })
                })
                .catch(e => {
                    axios.toast(axios.getError(e));
                })
                .then(() => {
                    setCheck(null);
                });
        }

    }, [check]);

    return <GridColumn className="py-2">

        <div className="admin-content-segment my-0 py-2">

            <div className="d-flex align-items-center">

                <span>
                    <Icon
                        name="world"
                        className="mr-3"
                        color={row.check?.status === 200 ? "green" : null}
                        disabled={row.check?.status === 200 ? false : true}
                    />
                </span>

                <Header
                    as="strong"
                    content={row.name}
                    subheader={<div className="sub header">
                        <a href={`https://${row.val}`} target="_blank">http://{row.val}</a>
                    </div>}
                    className="flex-grow-1"
                    style={{ fontSize: "1.1rem" }}
                />

                {!Boolean(row.check) && <Loader size="mini" active inline indeterminate />}

                {Boolean(row.check) && <div className="d-flex">

                    {forCheck === true && <Checkbox
                        title="Проверять сайт роботом для информаирования"
                        className="mx-2"
                        disabled={Boolean(check)}
                        checked={row.check_site}
                        onChange={(e, { checked }) => setCheck({ id: row.id, checked })}
                    />}

                    <pre className="m-0">{row.check?.status || 0}</pre>

                    <Icon
                        name={row.check?.status === 200 ? "check" : "ban"}
                        color={row.check?.status === 200 ? "green" : "red"}
                        className="ml-2 mr-0"
                        title={row.check?.error || "Сайт работает"}
                    />
                </div>}

            </div>

            <div ref={block} className="site-screen position-relative mt-2">
                {!image && <div className="icon-site opacity-10">
                    <Icon
                        name={Boolean(row.check?.error) ? "warning sign" : "world"}
                        color={Boolean(row.check?.error) ? "red" : (row.check?.status === 200 ? "green" : null)}
                        size="massive"
                        fitted
                        disabled
                    />
                </div>}
                {image && !Boolean(row.check?.error) && <Image
                    src={image}
                    alt={row.name}
                />}
            </div>

        </div>

    </GridColumn>
}

export default SiteRow;