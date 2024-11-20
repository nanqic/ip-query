module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { code, format, width } = req.query

    let urlBase = `https://ziguijia.com/chatroom/shoot/${code}`
    const respOne = await fetch(urlBase)
    let text = await respOne.text()
    const regex = /(date=\d+&amp;auth=\w+)/;
    const match = text.match(regex);

    if (match) {
        let date_auth = match[1]?.replace('amp;', '');

        let url = `https://stream.ziguijia.com/st?code=${code}&format=${format || 'mp4'}&width=${width || 480}&auth=${date_auth}`
        const resp = await fetch(url)
        console.log(resp.url);
        // let targetUrl = resp.url.replace('ziguijia.cn', 'ningway.com');

        return res.redirect(302, targetUrl);
    }

    return res.send('err');
}