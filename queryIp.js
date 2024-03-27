function queryIp(ip) {
    const ipRegex = /([a-fA-F\d]{1,4}:){2}[a-fA-F\d]{1,4}(:[a-fA-F\d]{1,4}){0,1}|([a-fA-F\d]{1,4}:){0,2}::([a-fA-F\d]{1,4}:){0,2}[a-fA-F\d]{0,4}|(\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/

    if (!ipRegex.test(ip)) return null
    let result
    if (ip.includes(':')) {
        const path = require('path');
        const dbPath = path.join(process.cwd(), '/node_modules/ip2region/data/ip2region.db');
        const v6dbPath = path.join(process.cwd(), '/node_modules/ip2region/data/ipv6wry.db');
        const IP2Region = require("ip2region").default;
        const query = new IP2Region({
            ipv4db: dbPath,
            ipv6db: v6dbPath,
            disableIpv6: false,
        });

        ip = ip.replace(/:[\da-fA-F]{0,3}$/, '::')
        result = query.search(ip);
    } else {
        const searcher = require('dy-node-ip2region').create();
        const rs = searcher.memorySearchSync(ip).region.split('|')
        result = {
            country: rs[0],
            province: rs[2],
            city: rs[3],
            isp: rs[4]
        }
    }

    return result
}

module.exports = queryIp