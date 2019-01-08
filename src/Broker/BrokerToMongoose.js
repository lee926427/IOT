let mosca = require('mosca');
let Mongoose = require('mongoose');
let mongoSet = {
    dbSet: {
        url: 'mongodb://localhost/IOT',
        colName: 'logs',
    }
}
let settings = {
    port:1883,
    http: {
        port: 3000,
        bundle: true,
        static: './public'
    },
}
let server = new mosca.Server(settings);
let data = Mongoose.model(mongoSet.dbSet.colName,
    new Mongoose.Schema({
        topic: String,
        date: String,
        record: {
                temperature: {
                    time: Number,
                    data: Number
                },
                humidity: {
                    time: Number,
                    data: Number
                }
            },
        })
    );
Mongoose.connect(mongoSet.dbSet.url, { useNewUrlParser: true })
getData()

//=====================MQTT Server========================
server.on('ready', function(){
    console.log('Mosca server is up and running');
});

server.on('clientConnected', (client) => {
    //connect MDB
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

server.on('published', function (packet, client) {
    let d = packet.payload.toString('utf8')
    let re = new RegExp('^{"')
    if (re.test(d)) {
        let o = JSON.parse(d)
        let toMongo = new data( o );
        toMongo.save((err, docs) => {
            if (err) console.log('err: ' + err);
            console.log('successly saved data');
            server.publish(`${packet.topic}`,'update')
        });
    }
});
//================get data from mongoDB===================
function getData() {
    data.find(
        {},
        { "humidity": 1, "temperature": 1, _id: 0, "date": 1 ,"class": 1},
        { sort: { 'created_at': -1 } ,limit: 10 },
        function (err, docs) {
            if (err) console.log(err);
            reconstruct(docs);
            //return docs;
    });
}

function reconstruct(d) {
    let newdata = {
        topic: "",
        date: '',
        data: [{
            class: new String,
            record: new Array
        }, {
            class: new String,
            record: new Array
        },
        ]
    }
    let t = d.map(function (item, index, array) {
        return item.data;
    });
    console.log( t );
}
