/* Copyright 2013 - 2022 Waiterio LLC */
const {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} = require('@polyblog/polyblog-js-client/accessToken.js')
const {
  setRefreshTokenForPolyblogClient,
} = require('@polyblog/polyblog-js-client/refreshToken.js')
const getAccessToken = require('./getAccessToken.js')
const getRefreshToken = require('./getRefreshToken.js')
const setAccessToken = require('./setAccessToken.js')

module.exports = async function rehydrateSession() {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  setAccessTokenForPolyblogClient(accessToken)
  setRefreshTokenForPolyblogClient(refreshToken)
  setAccessTokenCallbackForPolyblogClient(setAccessToken)
}
