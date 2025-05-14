const redis = require('redis');
require('dotenv').config(); 

const client = redis.createClient({
    url: process.env.REDIS_URL,
});

client.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

async function connectRedis() {
    if (!isConnected) {
        await client.connect();
        isConnected = true;
        console.log(`Successfully connected to Redis with url ${process.env.REDIS_URL}`);
    }
}

connectRedis().catch(console.error)

async function set(key,value,ttl){
    if (ttl){
        await client.set(key, value, { EX: ttl });
        return
    }
    await client.set(key, value);
}

async function get(key){
    return await client.get(key);
}

async function del(key){
    return await client.del(key);
}

module.exports = {
    set,
    get,
    del
};