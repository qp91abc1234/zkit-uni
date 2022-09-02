import {execa} from 'execa'
import chalk from "chalk";
import { fileURLToPath } from 'url'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const { prompt } = require('enquirer')
const cfg = require('./cfg.json')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgsPath = path.resolve(__dirname, '../packages');

const selectProject = async ()=>{
  const result = fs.readdirSync(pkgsPath);
  const { projName } = await prompt({
    type: 'select',
    name: 'projName',
    message: 'Select Project',
    choices: result
  })

  return projName
}

const selectEnv = async ()=>{
  const { envName } = await prompt({
    type: 'select',
    name: 'envName',
    message: 'Select Env',
    choices: cfg.env
  })

  return envName
}

const inputVersion = async (curVersion)=>{
  const { version } = await prompt({
    type: 'input',
    name: 'version',
    message: 'Input version',
    initial: curVersion
  })

  return version
}

const main = async ()=>{
  const projName = await selectProject()
  const envName = await selectEnv()
  
  const projPath = path.resolve(pkgsPath, `./${projName}`);
  const pkgJsonPath = path.resolve(projPath, `./package.json`);
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

  const version = await inputVersion(pkgJson.version)
  console.log(version);
}

main()