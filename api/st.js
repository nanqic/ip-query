module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { code, format, width } = req.query

    // let urlBase = `http://zgj.ningway.com:81/j?code=${code}`
    let urlBase = `https://ziguijia.com/j?code=${code}`
    const respOne = await fetch(urlBase)
    let text = await respOne.text()
    const regex = /(date=\d+&amp;auth=\w+)/;
    const match = text.match(regex);
    // console.log({match});

    if (match) {
        let date_auth = match[1]?.replace('amp;', '');
        // let date_auth = 'date=1732073879434&auth=a43fc54bdac09eb'
        let url = `https://stream.ziguijia.com/st?code=${code}&format=${format || 'mp4'}&width=${width || 720}&${date_auth}`
        const resp = await fetch(url)
        // console.log(resp.url);
        // let targetUrl = resp.url.replace('ziguijia.cn', 'ningway.com');

        return res.redirect(302, resp.url);
    }

    return res.send(match);
}