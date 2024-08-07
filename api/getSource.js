module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { code, auth, date, format, width } = req.query
    let url = `https://stream.ziguijia.com/st?code=${code}&format=${format || 'mp4'}&width=${width || 480}&date=${date}&auth=${auth}`
    const resp = await fetch(url)
    // console.log(resp.url);
    let targetUrl = resp.url.replace('ziguijia.cn', 'ningway.com');

    return res.redirect(302, targetUrl);
}