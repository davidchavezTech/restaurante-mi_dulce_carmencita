const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
const { ordenes_DDBB } = require('./keys');

//createPool es como createConnection pero mas forgiving
const pool = mysql.createPool(database);
const pool_ordenes = mysql.createPool(ordenes_DDBB);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        };
    }
    if (connection) {

    connection.release();
    console.log('DB is connected');
}
    return;
})

pool_ordenes.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        };
    }
    if (connection) {

    connection.release();
    console.log('DB is connected');
}
    return;
})

//Promisify Pool Querys - Nos permite hacer promesas
pool.query = promisify(pool.query);
pool_ordenes.query = promisify(pool_ordenes.query);
module.exports = {pool, pool_ordenes}