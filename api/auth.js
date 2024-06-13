module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // let url = `https://zgj.yhhdc.com/chatroom/shoot/00079`
    let url = `https://ziguijia.com/chatroom/shoot/00079`
    const resp = await fetch(url)
    let text = await resp.text()
    let date_auth = 'err'
    const regex = /(date=\d+&amp;auth=\w+)/;
    const match = text.match(regex);

    if (match) {
        date_auth = match[1]?.replace('amp;', '');
    }

    res.setHeader('Content-Type', 'text/plain');
    return res.send(date_auth);
}