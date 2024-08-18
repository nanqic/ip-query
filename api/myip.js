module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 访问者的IP地址
    let ip = req.headers['x-forwarded-for'] ||
        req.headers['x-real-ip']
        // console.log(ip);
        
    const queryIp = require('../queryIp');
    const result = queryIp(ip);

    if (!result) {
        return res.json({ err: 'ip is illegal' });
    }

    return res.json(result);
};