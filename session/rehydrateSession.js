/* Copyright 2013 - 2022 Waiterio LLC */
import {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} from '@polyblog/polyblog-js-client/accessToken.js'
import { setRefreshTokenForPolyblogClient } from '@polyblog/polyblog-js-client/refreshToken.js'
import getAccessToken from './getAccessToken.js'
import getRefreshToken from './getRefreshToken.js'
import setAccessToken from './setAccessToken.js'

export default async function rehydrateSession() {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  setAccessTokenForPolyblogClient(accessToken)
  setRefreshTokenForPolyblogClient(refreshToken)
  setAccessTokenCallbackForPolyblogClient(setAccessToken)
}
