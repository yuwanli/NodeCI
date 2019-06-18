const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')

const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
client.get = util.promisify(client.get)
client.hget = util.promisify(client.hget)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function(options = {}) {
    this._cache = true
    this._key = JSON.stringify(options.key || '')

    return this
}

mongoose.Query.prototype.exec = async function() {
    if (!this._cache){
        return await exec.apply(this,arguments)
    }

    const key = Object.assign({},this.getQuery(),{
        collection: this.mongooseCollection.name
    })
    const cacheValue = await client.hget(this._key, JSON.stringify(key))

    if (cacheValue){
        console.log('get data from cache')
        const doc = JSON.parse(cacheValue)

        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc)
    }

    const result = await exec.apply(this,arguments)

    client.hset(this._key, JSON.stringify(key), JSON.stringify(result), 'EX', 10) 
    console.log('get data from serve')
    return result
}

module.exports = {
    cleanHash(key) {
        client.del(JSON.stringify(key))
    }
}