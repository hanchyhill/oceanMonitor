const Agent = require('socks5-http-client/lib/Agent');
const request = require('request');

request({
	url: 'http://tropic.ssec.wisc.edu/',
	agentClass: Agent,
	agentOptions: {
		socksHost: 'localhost', // Defaults to 'localhost'.
		socksPort: 1080 // Defaults to 1080.
	}
}, function(err, res) {
	console.log(err || res.body);
});