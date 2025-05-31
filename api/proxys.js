module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    let { q, page } = req.query
    let url = `https://ziguijia.com/search?keywords=${q}${page?'&page='+page:''}`

    const resp = await fetch(url)
    let text = await resp.text()
    // console.log(url, page, text.slice(-20));
    const regx = new RegExp(`<(script|style|footer|button)(.|\n)*?>(.|\n)*?</(script|style|footer|button)>|<!DOC(.|\n)*?<(hr/?)>`)
    const regx2 = new RegExp(`href="/j\\?code(=\\w{5}(?:&amp;start=\\d{1,5})?)".target="\\w{5,6}"`, "ig")
    const regx3 = new RegExp(`href="/search\\?auth=\\d{6}&keywords=\\S{1,512}&page=(\\d{1,2})"`, "ig")

    text = text.replace(regx, '')
    const regxs = new RegExp(`<script(.|\n)*></script>`)
    text = text.replace(regxs, '')
    text = text.replace(regx2, (a, b) => {
        // console.log(a,b);
        return `onclick=window.open("/video?no${b.replace('amp;', '')}")`
    })
    text = text.replace(regx3, (a, b) => {
        // console.log(a, b, `onclick=window.open("/vsearch/+${b}")`);
        return `onclick=window.open("/vsearch/${keywords}/?page=${b}")`
    })
    text = text
        .replace(/href="\/search\??/ig, ' target="_blank" href="/vsearch')
        .replace(/keywords=/ig, '/').replace(/\?auth=\d+&amp;/ig, '')
        .replace(/&(?:amp;)page/ig, '?page')

    // 播放全部 链接替换
    text = text.replace(/\/vsearch\/player\??\//, `/search?codes=${getCodes(text)}&keywords=`)
    res.setHeader('Content-Type', 'text/html');

    return res.send(text);
}


function getCodes(text) {
    const regx = new RegExp(`data-code="(\\w{5})"`, "ig")
    let codes = ''
    let match;
    while ((match = regx.exec(text)) !== null) {
        const codeValue = match[1];
        codes += `${codeValue},`
    }
    return codes.slice(0, -1)
}