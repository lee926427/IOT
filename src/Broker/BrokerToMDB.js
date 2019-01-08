let mosca = require('mosca')

let mongo = {
    type: 'mongo',
    url: 'mongodb://192.168.137.1:27017/IOT',
    //url: 'mongodb://localhost:27017/IOT',
    pubsubCollection: 'Log',
    mongo: {},
}

let settings = {
    port:1883,
    http: {
        port: 3000,
        bundle: true,
        static: './public'
    },
    backend: mongo
};

var server = new mosca.Server(settings);
server.on('ready', function(){
	console.log('Mosca server is up and running');	
});

server.on('clientConnected', (client) => {
    console.log(`${client.id} is comming.`);
}).on('clientDisconnected', (client) => {
    console.log(`${client.id} was disconnected.`);
});
//---------------------------Subscribe Status-----------------------
server.on('subscribed', (topic, client) => {
    console.log(`client: ${client.id} subscribed the topic ${topic}`);

}).on('unsubscribed', (topic, client) => {
    console.log(`client: ${client.id} unsubscribed the topic ${topic}.`);
});

server.on('published', function(packet, client) {
    console.log('the packet:', packet.payload.toString('utf8'));
});