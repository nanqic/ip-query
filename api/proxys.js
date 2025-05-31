module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    let { q, page } = req.query
    let url = `https://ziguijia.com/search?auth=733175&keywords=${q}${page?'&page='+page:''}`
    const resp = await fetch(url)
    let text = await resp.text()
    // console.log(url, page, text.slice(-20));
  // 4. 定义清洗正则表达式
  const cleanupRegex = /<(script|style|footer|button)(.|\n)*?>(.|\n)*?<\/(\1)>|<!DOC(.|\n)*?<(hr\/?)>/gi;
  const scriptRegex = /<script(.|\n)*?<\/script>/gi;
  const videoLinkRegex = /href="\/j\?code(=\w{5}(?:&amp;start=\d{1,5})?)" target="\w{5,6}"/gi;
  const searchLinkRegex = /href="\/search\?auth=\d{6}&keywords=\S{1,512}&page=(\d{1,2})"/gi;

  // 5. 清洗和转换内容
  let processedText = text
    .replace(cleanupRegex, "")
    .replace(scriptRegex, "")
    .replace(videoLinkRegex, (match, p1) => 
      `onclick='window.open("/video?no${p1.replace("amp;", "")}")'`
    )
    .replace(searchLinkRegex, (match, p1) => 
      `onclick='window.open("/.netlify/functions/ziguijia-proxy?keywords=${encodeURIComponent(keywords)}&page=${p1}")'`
    )
    .replace(
      /href="\/search(\?[^"]*)"/gi,
      (match, query) => {
        const params = new URLSearchParams(query);
        const page = params.get("page") || "1";
        const keywords = params.get("keywords") || "";
        return `href="/.netlify/functions/ziguijia-proxy?keywords=${encodeURIComponent(keywords)}&page=${page}"`;
      }
    )
    .replace(
      /&amp;page/gi,
      "&page"
    );

    res.setHeader('Content-Type', 'text/html');
    return res.send(processedText);
}