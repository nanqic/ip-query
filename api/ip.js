

module.exports = function handler(req, res) {
    const allowedOrigins = ['http://localhost:5173', 'https://proxys.ningway.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    let { ip } = req.query

    ip = (Array.isArray(ip) ? ip[0] : ip || req.headers['x-forwarded-for']).trim()
    const queryIp = require('../queryIp')
    const result = queryIp(ip)
    if (!result) return res.json({ err: 'ip is ilegal' })
    return res.json(result)
}