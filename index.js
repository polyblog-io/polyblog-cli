#!/usr/bin/env node
/* Copyright 2013 - 2022 Waiterio LLC */

import { program } from 'commander'
import createCommand from './createCommand.js'
import downloadCommand from './downloadCommand.js'
import importCommand from './importCommand.js'

program
  .description('create a blog')
  .version('0.0.1')
  .addCommand(createCommand())
  .addCommand(downloadCommand())
  .addCommand(importCommand())

program.parse(process.argv)
