const chalk = require('chalk');
const spawn = require('child_process').spawn;

function done(code, projectName) {
    if (code !== 0) return;

    console.log('');
    console.log(`You can execute ${chalk.green(`\`cd ${projectName} && npm start\``)} to start the application`);
}

module.exports = function installDep(projectName) {
    let cmd = null;

    const args = ['install'];
    const opts = { cwd: projectName, stdio: 'inherit' };

    console.log(`☕️ ${chalk.green('Start installing dependencies')}`);
    console.log('');

    cmd = spawn('yarn', [...args], opts);

    cmd.once('error', () => {
        cmd = spawn('npm', [...args, '--registry=https://registry.npmmirror.com'], opts);

        cmd.once('close', code => done(code, projectName));
    })

    cmd.once('close', code => done(code, projectName));
};
