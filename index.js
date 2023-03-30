#!/usr/bin/env node
/* Copyright 2013 - 2022 Waiterio LLC */

const { program } = require('commander')
const createCommand = require('./createCommand.js')
const downloadCommand = require('./downloadCommand.js')
const importCommand = require('./importCommand.js')
const loginCommand = require('./loginCommand.js')
const logoutCommand = require('./logoutCommand.js')

program
  .description('create a blog')
  .version('0.0.1')
  .addCommand(createCommand())
  .addCommand(downloadCommand())
  .addCommand(importCommand())
  .addCommand(loginCommand())
  .addCommand(logoutCommand())

program.parse(process.argv)
