const fs = require('fs');
const path = require('path');
const fse = require('fs-extra')
const chalk = require('chalk');
const inquirer = require('inquirer');
const handlebars = require('handlebars');
const ora = require('ora');
const download = require('download-git-repo');
const symbols = require('log-symbols');

const templates = require('./templates');
const questiones = require('./questiones');
const installDep = require('./install-dep');

function printList() {
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
    return keyArr;
}

function ask(name, templateArr) {
    return new Promise(function (resolve, reject) {

        inquirer.prompt(questiones.template(templateArr)).then(ans => {
            const tempChoose = templates[ans.template];

            if (tempChoose) {
                // 通用问题
                inquirer.prompt(questiones.common).then(answers => {

                    const spinner = ora(chalk.green('正在下载模板...'));
                    spinner.start();

                    try {

                        const temp = `${name}/temp`;
                        const url = templates[ans.template].url;


                        download(url, temp, { clone: true }, (err) => {

                            if (err) {
                                spinner.fail();
                                console.log(symbols.error, chalk.red(err));

                                reject(err);
                            } else {
                                spinner.succeed();
                                console.log(chalk.green('√ 模板下载完毕'));
                            }

                            try {
                                const tempDir = path.resolve(__dirname, `../${temp}`);
                                fse.copySync(path.resolve(__dirname, `../${temp}/${tempChoose.local}`), path.resolve(__dirname, `../${name}`));
                                fse.removeSync(tempDir);
                                console.log('==================')
                            } catch (ex) {
                                console.log(symbols.error, chalk.red(ex));

                                reject(ex);
                            }


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

                            console.log(symbols.success, chalk.green('项目初始化完成!'));

                            resolve();

                        });

                    } catch (e) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red('下载失败'));

                        reject(e);
                    }

                });
            }
        });

    })

}

function init(name) {
    const templateArr = printList();
    ask(name, templateArr).then(function () {

        installDep(name);

    });
}


module.exports = {
    init,
}
