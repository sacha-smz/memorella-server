const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });

const prefix = "memorella_";

const cb = (resolve, reject) => (err, result) => {
  if (err) return reject(err);
  resolve(result);
};

module.exports = {
  set: (key, value) =>
    new Promise((resolve, reject) => {
      client.set(prefix + key, value, cb(resolve, reject));
    }),

  setex: (key, exp, value) =>
    new Promise((resolve, reject) => {
      client.setex(prefix + key, exp, value, cb(resolve, reject));
    }),

  hset: (key, field, value) =>
    new Promise((resolve, reject) => {
      client.hset(prefix + key, field, value, cb(resolve, reject));
    }),

  hget: (key, field) =>
    new Promise((resolve, reject) => {
      client.hget(prefix + key, field, cb(resolve, reject));
    }),

  hdel: (key, field) =>
    new Promise((resolve, reject) => {
      client.hdel(prefix + key, field, cb(resolve, reject));
    }),

  exists: key =>
    new Promise((resolve, reject) => {
      client.exists(prefix + key, cb(resolve, reject));
    })
};
