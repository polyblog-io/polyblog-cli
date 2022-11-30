#!/usr/bin/env node
/* Copyright 2013 - 2022 Waiterio LLC */

import path from 'path'
import program from 'commander'
import git from 'simple-git'

program.description('create a blog').version('0.0.1').parse(process.argv)

async function main() {
  console.log('create-polyblog')
  const repoUrl = 'https://github.com/polyblog-io/nextjs-blog-example.git'
  const repoPath = path.resolve(__dirname, './repo')
  await git().clone(repoUrl, repoPath, ['--depth', '1'])
}

main()
