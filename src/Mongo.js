import React, { Component } from 'react';
import { Mongoose, Schema, model } from 'mongoose';


class Mongo extends Component {

    state = {
        dbSet: {
            url: 'mongodb://192.167.137.1',
            dbName: '/IOT',
            colName: 'Log',
        }
    }

    componentDidMount() {
    
    }
    saveMongo() {

        let data = model(this.state.dbSet.colName, { data: {} });

        Mongoose.connect(this.state.dbSet.url + this.state.dbSet.dbName)
    }
        
    }
    render() {
        return <div id="Mongoose"></div>
    }
}

export default Mongo;
