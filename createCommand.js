/* Copyright 2013 - 2022 Waiterio LLC */
import path from 'path'
import git from 'simple-git'
import { Command } from 'commander'

function createCommand() {
  
  const command = new Command('create')
  command.action(async (options) => {
    console.log('create-polyblog')
    const repoUrl = 'https://github.com/polyblog-io/nextjs-blog-example.git'
    const repoPath = path.resolve(__dirname, './repo')
    await git().clone(repoUrl, repoPath, ['--depth', '1'])
  })

  return command
  
}

export default createCommand
