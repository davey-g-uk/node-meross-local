# Meross Control for Node
A library to control Meross plugs on the local network without the use of the Meross cloud.

Essentially this is just a pure library version of https://github.com/dehsgr/node-red-contrib-meross.

# Installation

	npm i meross-local

# Usage

Simple example

```javascript
const { MerossSmartPlug } = require("meross-local");

const address = "192.168.1.123";
const key = "<your key>"; // use https://github.com/jixunmoe/meross-login to retrieve it from your account

const plug = new MerossSmartPlug(address, key);

plug.turnOn().then(resp => console.log(resp))
```

More examples of basic functionality are found in the _examples/_ folder.

# Methods

## MerossSmartPlug

`constructor(address, key)`  
Creates a new instance of the API. `address` is just the IP address of your plug. You can get the `key` either by sniffing your network traffic or by using https://github.com/jixunmoe/meross-login.

`getState() -> Promise<Object>`  
Performs a `GET Appliance.System.All` and retrieves the entire state in one request.

`getPower(channel = 0) -> Promise<Boolean>`  
Returns either `true` or `false` depending on if the plug is turned on or not.

`setPower(power, channel = 0) -> Promise<Object>`  
Performs a `SET Appliance.Control.ToggleX` to set the specific channel to either on or off depending on the `power` argument.
Returns the whole response the plug sends back.

`turnOn(channel = 0) -> Promise<Object>`  
Convenience method to call `setPower(true)`.

`turnOff(channel = 0) -> Promise<Object>`  
Convenience method to call `setPower(false)`.