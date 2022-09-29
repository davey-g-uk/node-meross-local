const crypto = require("crypto");
const axios = require("axios");

class MerossSmartPlug {
	constructor(address, key, opts = {}) {
		this._key = key;
		this._address = address;
        this._uuid = null;
		this._lastrequest = null;
		console.log('DG MEROSS PLUGIN');
	}

	async _sendRequest(method, namespace, payload) {
		const timestamp = Math.floor(Date.now() / 1000);
		if (timestamp != this._lastrequest) { //rate limit local requests
            const timestamp = Math.floor(Date.now() / 1000);
            const messageId = crypto.createHash("md5").update(`${timestamp}`).digest("hex");
            const signKey = crypto.createHash("md5").update(messageId + this._key + timestamp).digest("hex");
            this._lastrequest = timestamp;
            return axios.post(`http://${this._address}/config`, {
                header: {
                    messageId,
                    method,
                    from: `http://${this._address}/config`,
                    sign: signKey,
                    namespace,
                    timestamp,
                    payloadVersion: 1,
                    uuid: this._uuid
                },
                payload,
            });
        } else {
            await delay(1);
            return this._sendRequest(method,namespace,payload);
        }
	}
    async _getUUID() {
		const resp = await this._sendRequest("GET", 'Appliance.System.All', {});
		return resp.data.payload.all.system.hardware.uuid;
	}

	async getState() {
		const resp = await this._sendRequest("GET", 'Appliance.System.All', {});
        this._uuid = resp.data.payload.all.system.hardware.uuid;
		return resp.data;
	}

	async getPower(channel = 0) {
		return (await this.getState()).payload.all.digest.togglex[channel].onoff == 1;
	}

	async setPower(power, channel = 0) {
		console.log('DG MEROSS PLUGIN : Set power');
        if (this._uuid == null) {
            this._uuid = await this._getUUID;
        }
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

function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

module.exports = { MerossSmartPlug };