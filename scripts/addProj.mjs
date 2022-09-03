import {execa} from 'execa'
import chalk from "chalk";
import { fileURLToPath } from 'url'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs')
const path = require('path')
const { prompt } = require('enquirer')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgsPath = path.resolve(__dirname, '../packages')

const copyFolder = (fromPath, toPath)=>{  
  let packages = fs.readdirSync(fromPath)
  if (Array.isArray(packages) && packages.length > 0) {
    packages = packages.filter(item => item !== 'dist' && item !== 'node_modules')
  } else {
    console.log(chalk.red('\nFiles is not exist'))
    return
  }

  if (!fs.existsSync(toPath)) {
    fs.mkdirSync(toPath)
  }

  packages.forEach((item) => {
    var originPath = fromPath + '\\' + item
    var targetPath = toPath + '\\' + item
    var file = fs.statSync(originPath)
    if (file.isFile()) {
      fs.copyFileSync(originPath, targetPath)
    } else if (file.isDirectory()) {
      copyFolder(originPath, targetPath);
    }
  });
}

const inputProjName = async ()=>{
  const { projName } = await prompt({
    type: 'input',
    name: 'projName',
    message: 'Input Project Name'
  })

  return projName
}

const inputAppId = async ()=>{
  const { appId } = await prompt({
    type: 'input',
    name: 'appId',
    message: 'Input AppId'
  })

  return appId
}

const createProj = (projName, appId)=>{
  const templatePath = path.resolve(pkgsPath, `./template`)
  const projPath = path.resolve(pkgsPath, `./${projName}`)
  fs.rmSync(projPath, {force: true, recursive: true})
  copyFolder(templatePath, projPath)

  const pkgJsonPath = path.resolve(projPath, `./package.json`)
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
  pkgJson.name = projName
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n')

  const manifestJsonPath = path.resolve(projPath, `./src/manifest.json`)
  const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf-8'))
  manifestJson['mp-weixin'].appid = appId
  fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + '\n')
}

const installDeps = async (projName)=>{
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    initial: 'true',
    message: `Install Deps?`
  })

  if(yes) {
    await execa('pnpm', ['install', '-F', `${projName}`], { stdio: 'inherit' })
  }
}

const main = async ()=>{
  const projName = await inputProjName()
  const appId = await inputAppId()
  createProj(projName, appId)  
  await installDeps(projName)  

  console.log(chalk.green('\nProject create success~'))
}

main()