#!/usr/bin/env node
/* Copyright 2013 - 2022 Waiterio LLC */

import { program } from 'commander'
import createCommand from './createCommand.js'
import downloadCommand from './downloadCommand.js'
import importCommand from './importCommand.js'
import packageJson from './package.json' assert { type: 'json' }

program
  .description('create a blog')
  .version(packageJson.version)
  .addCommand(createCommand())
  .addCommand(downloadCommand())
  .addCommand(importCommand())

program.parse(process.argv)
