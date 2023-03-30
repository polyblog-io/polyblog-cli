/* Copyright 2013 - 2022 Waiterio LLC */
const path = require('path')
const git = require('simple-git')
const { Command } = require('commander')

function createCommand() {
  const command = new Command('create')
  command.action(async options => {
    console.log('create-polyblog')
    const repoUrl = 'https://github.com/polyblog-io/nextjs-blog-example.git'
    const repoPath = path.resolve(__dirname, './repo')
    await git().clone(repoUrl, repoPath, ['--depth', '1'])
  })

  return command
}

module.exports = createCommand
