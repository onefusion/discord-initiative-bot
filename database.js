const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/initbot_mongodb';

    // connect to the database
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});

    // verify connection successful or console log error
    let con = mongoose.connection;

    con.on('connected', function() {
        console.log('db connected');
    });

    con.on('disconnected',function() {
        console.log('db disconnected');
    });

    con.on('error', console.error.bind(console, 'connection error:'));

    module.exports = con;