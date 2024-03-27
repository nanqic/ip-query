
module.exports = function handler(req, res) {
    let { ip } = req.query

    ip = (Array.isArray(ip) ? ip[0] : ip || req.headers['x-forwarded-for']).trim()
    const queryIp = require('../queryIp')
    const result = queryIp(ip)
    if (!result) return res.json({ err: 'ip is ilegal' })

    return res.json(result)
}