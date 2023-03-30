/* Copyright 2013 - 2022 Waiterio LLC */

const {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} = require('@polyblog/polyblog-js-client/accessToken.js')
const {
  setRefreshTokenForPolyblogClient,
} = require('@polyblog/polyblog-js-client/refreshToken.js')
const localStorage = require('./localStorage.js')

module.exports = function clearSession() {
  localStorage.clear()

  setAccessTokenCallbackForPolyblogClient(null)

  setAccessTokenForPolyblogClient(null)
  setRefreshTokenForPolyblogClient(null)
}
