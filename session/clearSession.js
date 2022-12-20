/* Copyright 2013 - 2022 Waiterio LLC */

import {
  setAccessTokenForPolyblogClient,
  setAccessTokenCallbackForPolyblogClient,
} from '@polyblog/polyblog-js-client/accessToken.js'
import { setRefreshTokenForPolyblogClient } from '@polyblog/polyblog-js-client/refreshToken.js'
import localStorage from './localStorage.js'

export default function clearSession() {
  localStorage.clear()

  setAccessTokenCallbackForPolyblogClient(null)

  setAccessTokenForPolyblogClient(null)
  setRefreshTokenForPolyblogClient(null)
}
