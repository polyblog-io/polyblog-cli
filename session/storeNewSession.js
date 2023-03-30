/* Copyright 2013 - 2022 Waiterio LLC */
const {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} = require('@polyblog/polyblog-js-client/accessToken.js')
const {
  setRefreshTokenForPolyblogClient,
} = require('@polyblog/polyblog-js-client/refreshToken.js')
const setAccessToken = require('./setAccessToken.js')
const setRefreshToken = require('./setRefreshToken.js')

module.exports = async function storeNewSession({ accessToken, refreshToken }) {
  try {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    setAccessTokenForPolyblogClient(accessToken, setAccessToken)
    setRefreshTokenForPolyblogClient(refreshToken, setRefreshToken)
    setAccessTokenCallbackForPolyblogClient(setAccessToken)

    return true
  } catch (error) {
    console.error('error', error)
    throw error
  }
}
