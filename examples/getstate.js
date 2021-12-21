const { MerossSmartPlug } = require("..");

if (process.argv.length < 4) {
	console.log("Usage: node getstate.js <address> <key>")
	process.exit(0);
}

const address = process.argv[2];
const key = process.argv[3];

const plug = new MerossSmartPlug(address, key);

plug.getState().then(resp => console.log(resp.payload.all.digest))