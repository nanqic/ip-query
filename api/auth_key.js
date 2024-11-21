module.exports = async function handler(req, res) {
    let { no } = req.query

    let url = `https://ziguijia.com/j?code=${no}`
    const resp = await fetch(url)
    let text = await resp.text()
    
    let date_auth = ''
    const regex = /(date=\d+&amp;auth=\w+)/;
    const match = text.match(regex);

    if (match) {
        match[1]?.replace('amp;', '');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/plain');

    return res.send(date_auth);
}