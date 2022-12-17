/* Copyright 2013 - 2022 Waiterio LLC */
import path from 'path'
import { Command } from 'commander'

function importCommand() {
  
  const command = new Command('import')
  command.option('--project [project]', 'project id or name')

  command.action(async (options) => {
    console.log('import')

  })

  return command
  
}

export default importCommand
