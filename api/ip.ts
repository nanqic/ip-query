const IP2Region = require("ip2region").default;

module.exports = function handler(req, res) {
    const { ip } = req.query
    const ipRegex = /([a-fA-F\d]{1,4}:){2}[a-fA-F\d]{1,4}(:[a-fA-F\d]{1,4}){0,1}|([a-fA-F\d]{1,4}:){0,2}::([a-fA-F\d]{1,4}:){0,2}[a-fA-F\d]{0,4}|(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/

    if (!ip) return res.json({ err: 'ip is null' })
    let ipaddr = (Array.isArray(ip) ? ip[0] : ip).trim()

    if (!ipRegex.test(ipaddr)) return res.json({ err: 'ip fmt is ilegal' })

    const path = require('path');
    const dbPath = path.join(process.cwd(), '/node_modules/ip2region/data/ip2region.db');
    const v6dbPath = path.join(process.cwd(), '/node_modules/ip2region/data/ipv6wry.db');

    const query = new IP2Region({
        ipv4db: dbPath,
        ipv6db: v6dbPath,
        disableIpv6: false,
    });

    ipaddr = ipaddr.replace(/:[\da-fA-F]{0,3}$/, '::')
    const result = query.search(ipaddr);

    return res.json(result)
}