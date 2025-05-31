module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { q, page } = req.query;
    const url = `https://ziguijia.com/search?keywords=${q}${page ? '&page=' + page : ''}`;

    const resp = await fetch(url);
    let html = await resp.text();

    // 清理不需要的标签和文档声明
    html = html.replace(/<(script|style|footer|button|hr|!DOC)[^>]*>.*?<\/\1\s*>|<\/(script|style|footer|button)>/gis, '');

    // 替换视频链接（原regx2）
    html = html.replace(/href="\/j\?code(=(\w{5})(?:&amp;start=\d{1,5})?)"[^>]*?>/ig, 
        (_, code) => `onclick="window.open('/video?no${code.replace('amp;', '')}')"`);

    // 替换分页链接（原regx3）
    html = html.replace(/href="\/search\?auth=\d+&amp;keywords=([^&"]+?)&amp;page=(\d{1,2})"/ig, 
        (_, keywords, pageNum) => `onclick="window.open('/vsearch/${q}/?page=${pageNum}')"`);

    // 替换其他搜索链接
    html = html
        .replace(/href="\/search/ig, 'target="_blank" href="/vsearch')
        .replace(/(\?|&amp;)auth=\d+&amp;/ig, '$1')
        .replace(/keywords=([^&"]+?)(&amp;page=|\")/ig, (_, kw, suffix) => 
            suffix.startsWith('&amp;') ? `?page=${suffix.split('=')[1]}` : '');

    // 添加播放全部功能
    if (html.includes('/vsearch/player/')) {
        const codes = [...html.matchAll(/data-code="(\w{5})"/g)]
            .map(match => match[1])
            .join(',');
        html = html.replace('/vsearch/player/', `/search?codes=${codes}&keywords=`);
    }

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
};