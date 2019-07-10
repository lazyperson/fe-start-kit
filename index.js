#!/usr/bin/env node

const fs = require('fs');
const cmder = require('commander');
const exec = require('child_process').exec;
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const packageJson = require('./package.json');
const templates = require('./templates');
const questiones = require('./question');

const preCssTypeArr = ['LESS', 'SCSS'];

cmder.version(packageJson.version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {

      console.log('\n');
      console.log(chalk.green('---------------------------------------------'));
      const keyArr = [];
      Object.keys(templates).forEach(function (key) {
        keyArr.push(key);
        var arr = new Array(30);
        console.log(chalk.green((key + arr.join(' ')).substr(0, 15) + '    |    ' + templates[key].description));
      });
      console.log(chalk.green('---------------------------------------------'));
      console.log('\n');

      inquirer.prompt(questiones.template(keyArr)).then((ans) => {
        if (templates[ans.template]) {

          inquirer.prompt(questiones.preCssType(preCssTypeArr)).then((cssRes) => {
            const preCssType = cssRes.preCssType.toLowerCase();

            inquirer.prompt(questiones.mulQuestion).then((answers) => {
              const spinner = ora(chalk.green('正在下载模板...'));
              spinner.start();
              try {
                const url = templates[ans.template].url;
                download(url, name, {
                  clone: true
                }, (err) => {
                  if (err) {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                  } else {
                    spinner.succeed()
                    console.log(chalk.green('√ 模板下载完毕'));
                    const fileName = `${name}/package.json`;
                    const { keywords, license, description, author, version } = answers;
                    const meta = {
                      name,
                      keywords: keywords.split(' '),
                      version,
                      license,
                      description,
                      author
                    };
                    if (fs.existsSync(fileName)) {
                      const content = fs.readFileSync(fileName).toString();
                      const result = handlebars.compile(content)(meta);
                      fs.writeFileSync(fileName, result);
                    }
                    const fileAppName = `${name}/src/App.js`;
                    if (fs.existsSync(fileAppName)) {

                      const content = fs.readFileSync(fileAppName).toString();
                      const result = handlebars.compile(content)({ preCssType });
                      fs.writeFileSync(fileAppName, result);

                      const otherExt = preCssType === preCssTypeArr[0] ? preCssTypeArr[1] : preCssTypeArr[0];
                      const otherCssFile = `${name}/src/App.${otherExt.toLowerCase()}`;
                      if (fs.existsSync(otherCssFile)) {
                        fs.unlinkSync(otherCssFile);
                      }
                    }

                    console.log(symbols.success, chalk.green('项目初始化完成!'));

                    //const cmdStr = `cd ${name} && npm install`;
                    // const spinner2 = ora(chalk.green('正在安装依赖...'));
                    // spinner2.start();
                    // exec(cmdStr, (error, stdout, stderr) => {
                    //   if (error) {
                    //     spinner2.fail();
                    //     console.log(error, chalk.red('启动失败'));
                    //     process.exit();
                    //   }
                    //   spinner2.succeed();
                    //   console.log(chalk.white.bgBlue('DONE!'));
                    //   process.exit();
                    //   exec('npm run start');
                    // })

                  }
                })
              } catch (ex) {
                spinner.fail();
                console.log(symbols.error, chalk.red('下载失败'));
              }
            });

          })



        }
        else {
          console.log(symbols.error, chalk.red('输入的模板类型不存在'));
        }
      });
    } else {
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })


// 模板列表
cmder.command('help')
  .description('查看所有可用模板')
  .action(() => {
    console.log(`
      fe-start-kit init <name>  初始化项目
        `)
  });

cmder.parse(process.argv);


if (!cmder.args.length) {
  cmder.help();
}