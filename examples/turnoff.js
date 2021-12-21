const { MerossSmartPlug } = require("..");

if (process.argv.length < 4) {
	console.log("Usage: node turnoff.js <address> <key>")
	process.exit(0);
}

const address = process.argv[2];
const key = process.argv[3];

const plug = new MerossSmartPlug(address, key);

plug.turnOff().then(resp => console.log(resp))