const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');
const { ordenes_DDBB } = require('./keys');
const { meseros_DDBB } = require('./keys');

//createPool es como createConnection pero mas forgiving
const restaurante = mysql.createPool(database);
const pool_ordenes = mysql.createPool(ordenes_DDBB);
const pool_meseros = mysql.createPool(meseros_DDBB);

restaurante.getConnection((err, connection) => {
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
}
    return;
})

pool_meseros.getConnection((err, connection) => {
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
}
    return;
})

//Promisify Pool Querys - Nos permite hacer promesas
restaurante.query = promisify(restaurante.query);
pool_ordenes.query = promisify(pool_ordenes.query);
pool_meseros.query = promisify(pool_meseros.query);
module.exports = {restaurante, pool_ordenes, pool_meseros}