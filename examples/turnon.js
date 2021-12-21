const { MerossSmartPlug } = require("..");

if (process.argv.length < 4) {
	console.log("Usage: node turnon.js <address> <key>")
	process.exit(0);
}

const address = process.argv[2];
const key = process.argv[3];

const plug = new MerossSmartPlug(address, key);

plug.turnOn().then(resp => console.log(resp))