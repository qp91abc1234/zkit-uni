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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgsPath = path.resolve(__dirname, '../packages');

const copyFolder = (path, targetPath, filename)=>{
  let packages = fs.readdirSync(path);
  targetPath = targetPath + (filename ? '\\' + filename : '');
  if (Array.isArray(packages) && packages.length > 0) {
    packages = packages.filter(item => !item.endsWith('map') && item !== 'stats.json');
  } else {
    console.log(chalk.red('\nFiles is not exist'));
    return;
  }

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  // 遍历原目录下的文件名
  packages.forEach((item, index) => {
    var originPath = path + '\\' + item; // 获取原文件路径
    var _targetPath = targetPath + '\\' + item;
    var file = fs.statSync(originPath); // 获取原目录下文件的文件信息
    if (file.isFile()) {
      // 文件
      fs.copyFileSync(originPath, _targetPath);
    } else if (file.isDirectory()) {
      // 目录
      if (!fs.existsSync(_targetPath)) {
        fs.mkdirSync(_targetPath);
      }
      copyFolder(originPath, _targetPath);
    }
  });
}

const inputProjName = async ()=>{
  const { projName } = await prompt({
    type: 'input',
    name: 'projName',
    message: 'Input version'
  })

  return projName
}

const inputAppId = async ()=>{
  const { appId } = await prompt({
    type: 'input',
    name: 'appId',
    message: 'Input version'
  })

  return appId
}

const main = async ()=>{
  const projName = await inputProjName()
  const appId = await inputAppId()
  
  const projPath = path.resolve(pkgsPath, `./${projName}`);
  const pkgJsonPath = path.resolve(projPath, `./package.json`);
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
}

main()