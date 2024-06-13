module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { q, page } = req.query
    let url = `https://ziguijia.com/search?auth=733175&keywords=${q}${page?'&page='+page:''}`
    const resp = await fetch(url)
    let text = await resp.text()
    // console.log(url, page, text.slice(-20));

    res.setHeader('Content-Type', 'text/html');
    return res.send(text);
}