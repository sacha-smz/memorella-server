const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const redis = require("../redis");

const utils = {
  signAccessToken: user =>
    jwt.sign(getPayload(user), process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "12m"
    }),

  signRefreshToken: async (user, needsUpdate) => {
    if (!needsUpdate) {
      const oldRefreshToken = await redis.hget("refresh_tokens", user.id);
      if (oldRefreshToken) return oldRefreshToken;
    }

    const refreshToken = jwt.sign(getPayload(user), process.env.REFRESH_TOKEN_SECRET);
    await redis.hset("refresh_tokens", user.id, refreshToken);
    return refreshToken;
  },

  isValidRefreshToken: async (user, token) => {
    const result = await redis.hget("refresh_tokens", user.id);
    return result === token;
  },

  revokeAccessToken: async token => {
    const payload = await verifyToken("access", token);
    return await utils.blacklistAccessToken(payload);
  },

  blacklistAccessToken: async payload => {
    const key = "invalid_token_" + payload.jti;

    if (payload.exp) {
      const remainingMs = payload.exp * 1000 - Date.now();
      if (remainingMs <= 0) return "OK";
      return await redis.setex(key, Math.round(remainingMs / 1000), 1);
    }

    return await redis.set(key, 1);
  },

  revokeRefreshToken: async token => {
    const user = await verifyToken(token, "refresh");
    return await utils.revokeUserRefreshToken(user);
  },

  revokeUserRefreshToken: async user => {
    return await redis.hdel("refresh_tokens", user.id);
  },

  isRevokedToken: async payload => {
    return await redis.exists("invalid_token_" + payload.jti);
  }
};

function verifyToken(type, token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env[type.toUpperCase() + "_TOKEN_SECRET"], (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}

function getPayload({ id, email, is_admin }) {
  return { id, email, is_admin, jti: uuidv4() };
}

module.exports = utils;
