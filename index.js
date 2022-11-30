#!/usr/bin/env node
/* Copyright 2013 - 2022 Waiterio LLC */

import { program } from 'commander'
import create from './create.js'
import download from './download.js'

program.name('polyblog').description('create a blog').version('0.0.1')

program.command('create').action(create)
program
  .command('download')
  .option('-b, --blog <blogId>', 'blogId from polyblog.io')
  .argument('[directory]', 'directory to download to the blog')
  .action(download)

program.parse(process.argv)
