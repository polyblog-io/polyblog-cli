/* Copyright 2013 - 2022 Waiterio LLC */
import { Command } from 'commander'
import clearSession from './session/clearSession.js'

function logoutCommand() {
  const command = new Command('logout')
  command.action(async () => {
    try {
      console.log('logout')

      clearSession()

      console.log('logged out')
    } catch (error) {
      console.log('error', error)
    }
  })

  return command
}

export default logoutCommand
