/* Copyright 2013 - 2022 Waiterio LLC */
const { Command } = require('commander')
const clearSession = require('./session/clearSession.js')

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

module.exports = logoutCommand
