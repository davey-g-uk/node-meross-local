const crypto = require("crypto");
const axios = require("axios");

class MerossSmartPlug {
	constructor(address, key, opts = {}) {
		this._key = key;
		this._address = address;
	}

	_sendRequest(method, namespace, payload) {
		const timestamp = Math.floor(Date.now() / 1000);
		const messageId = crypto.createHash("md5").update(`${timestamp}`).digest("hex");
		const signKey = crypto.createHash("md5").update(messageId + this._key + timestamp).digest("hex");

		return axios.post(`http://${this._address}/config`, {
			header: {
				messageId,
				method,
				from: `http://${this._address}/config`,
				sign: signKey,
				namespace,
				timestamp,
				payloadVersion: 1,
			},
			payload,
		});
	}

	async getState() {
		const resp = await this._sendRequest("GET", 'Appliance.System.All', {});

		return resp.data;
	}

	async getPower(channel = 0) {
		return (await this.getState()).payload.all.digest.togglex[channel].onoff == 1;
	}

	async setPower(power, channel = 0) {
		const resp = await this._sendRequest("SET", 'Appliance.Control.ToggleX', {
			togglex: {
				onoff: power ? 1 : 0,
				channel,
			}
		});

		return resp.data;
	}

	async turnOn(channel = 0) {
		return this.setPower(true, channel);
	}

	async turnOff(channel = 0) {
		return this.setPower(false, channel);
	}
}

module.exports = { MerossSmartPlug };