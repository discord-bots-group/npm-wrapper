const snekfetch = require('snekfetch');

class Client {
    constructor(id, token) {
        if (typeof token !== 'string') throw new TypeError('The bot token must be a string!');
        if (typeof id !== 'string') throw new TypeError('The bot ID must be a string!');
        this._baseURL = 'https://discordbots.group/api';
        this._token = token;
        this._id = id;
    }

    updateServerCount(serverCount) {
        if (typeof serverCount !== 'number' && !(serverCount instanceof Array)) throw new TypeError('Server count is not a number.');
        snekfetch.post(this._baseURL + '/bot/' + this._id, {headers: { 'content-type': 'application/x-www-form-urlencoded', 'authorization': this._token }, data: {count: serverCount } })

        }

    getBotInfo(id) {
        if (typeof id !== 'string') throw new TypeError('Bot ID must be a string');
        return new Promise((resolve, reject) => {
            snekfetch.get(this._baseURL + '/bot/' + id).then((bot) => {
                resolve(bot.body);    
            })
        });
    }

    getCurrentBot() {
        if (typeof this._id !== 'string') throw new TypeError('Bot ID must be a string');
        return new Promise((resolve, reject) => {
            snekfetch.get(this._baseURL + '/bot/' + this._id).then((bot) => {
                resolve(bot.body);
            })
        });
    }
}

module.exports = Client;