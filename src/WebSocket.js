const ws = require('ws');
const EventEmitter = require('events').EventEmitter;

/**
 * Creates a new WebSocket client
 * @class WebSocket
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
    /**
     * @param {object} options An object with options
     * @param {number} [options.heartbeatInterval] The amount of seconds between each heartbeat. Must be below or equal to 50.
     * @param {array<string>} options.tokens An array of bot tokens.
     * @param {boolean} [options.reconnect] Tells the websocket to reconnect after a disconnect.
     */
    constructor(options) {
        super();

        if (typeof options != 'object') throw new TypeError('options must be an object');
        if ('reconnect' in options && typeof options.reconnect !== 'boolean') throw new TypeError('reconnect must be a boolean when provided');
        if (!Array.isArray(options.tokens) || !options.tokens.every((token) => typeof token === 'string')) throw new TypeError('tokens must be an array of strings');
        if ('heartbeatInterval' in options && typeof options.heartbeatInterval !== 'number') throw new TypeError('heartbeatInterval must be a number when provided');
        if ('heartbeatInterval' in options && options.heartbeatInterval > 50) throw new TypeError('heartbeatInterval must be less than or equal to 50');

        this._options = {
            tokens: options.tokens,
            reconnect: options.reconnect || true,
            heartbeatInterval: options.heartbeatInterval || 30
        };
        this._heartbeat = null;

        this._socket = new ws('wss://gateway.discordbots.group');
        this._socket.on('open', this._onOpen.bind(this));
        this._socket.on('close', this._onClose.bind(this));
        this._socket.on('error', this._onError.bind(this));
        this._socket.on('message', this._onMessage.bind(this));

    }

    /**
     * Called when socket is open
     * @private
     * @extends WebSocket
     */
    _onOpen() {
        this.emit('connected');
        this._send(0, { tokens: this._options.tokens });
        this._heartbeat = setInterval(() => {
            if (this._socket.readyState === this._socket.OPEN) {
                this._sendHeartbeat();
            } else {
                clearInterval(this._heartbeat);
                this._heartbeat = null;
            }
        }, 1000 * this._options.heartbeatInterval);
    }

    /**
     * Called when socket sends message
     * @param data
     * @private
     */
    _onMessage(data) {
        try {
            data = JSON.parse(data);
            if (data.op === 2) {
                this.emit('heartbeatAck');
            } else if (data.op === 3) {
                this.emit('upvote', new BotUpvote(data.data));
            } else if (data.op === 4) {
                this.emit('pageView', new BotView(data.data));
            }
        } catch (e) {
            this.emit('error', e);
        }
    }

    /**
     * Called when socket errors
     * @param error
     * @private
     */
    _onError(...errors) {
        this.emit('error', ...errors);
    }

    /**
     * Called when socket is closed
     * @param code
     * @param message
     * @private
     */
    _onClose(code, message) {
        clearInterval(this._heartbeat);
        this._heartbeat = null;
        this.emit('disconnected', new CloseEvent(code, message));
        if (this._options.reconnect) {
            this.emit('reconnecting');
            delete this._socket;
            this._socket = new ws('wss://gateway.discordbots.group');
            this._socket.on('open', this._onOpen.bind(this));
            this._socket.on('close', this._onClose.bind(this));
            this._socket.on('error', this._onError.bind(this));
            this._socket.on('message', this._onMessage.bind(this));
        }
    }

    /**
     * Send a payload to the websocket
     * @param op
     * @param data
     * @private
     */
    _send(op, data) {
        this._socket.send(JSON.stringify({ op, t: Date.now(), data }));
    }

    /**
     * Send a heartbeat to the server
     * @private
     */
    _sendHeartbeat() {
        this._send(1, {});
    }
}

class CloseEvent {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

class BotUpvote {
    constructor(data) {
        this.bot = data.bot;
        this.user = data.user;
    }
}

class BotView {
    constructor(data) {
        this.bot = data.bot;
    }
}

module.exports = WebSocket;