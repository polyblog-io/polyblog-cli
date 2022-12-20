/* Copyright 2013 - 2022 Waiterio LLC */
import {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} from '@polyblog/polyblog-js-client/accessToken.js'
import { setRefreshTokenForPolyblogClient } from '@polyblog/polyblog-js-client/refreshToken.js'
import setAccessToken from './setAccessToken.js'
import setRefreshToken from './setRefreshToken.js'

export default async function storeNewSession({ accessToken, refreshToken }) {
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
