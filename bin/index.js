#!/usr/bin/env node

var cmder = require('commander');
var lib = require('../lib');

var packageJson = require('../package.json');

cmder.version(packageJson.version, '-v, --version')
    .command('init <name>')
    .action(name => {
        lib.init(name);
    });


// 模板列表帮助
cmder.command('help')
    .description('查看所有可用命令')
    .action(() => {
        console.log(`
      fe-start-kit init <name>  初始化项目
        `);
    });


cmder.parse(process.argv);


if (!cmder.args.length) {
    cmder.help();
}
