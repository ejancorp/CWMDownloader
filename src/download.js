import fs from 'fs';
import ora from "ora";
import chalk from "chalk";
import inquirer from 'inquirer';
import CourseListing from './modules/CourseListing.js';
import CurlHelper from './helpers/CurlHelper.js';
import Settings from './helpers/Settings.js';

export default async function download(options) {

  await Settings.read();

  const file = fs.readFileSync(options.file, 'utf8');
  const { method, headers, body } = CurlHelper.parse(file);

  const listingSpinner = ora(chalk.yellow(`Getting the list of available courses...`)).start();
  const courses = await CourseListing({ method, headers, body });

  listingSpinner.succeed(chalk.green(`Here are the available courses:`));

  await inquirer.prompt({
    type: 'list',
    name: 'likedItem',
    message: 'Which course do you like?',
    choices: courses.map(item => ({ name: item.name, value: item.value }))
  }).then(answers => {
    console.log(`You selected: ${answers.likedItem}`);
  }).catch(error => {
    console.error('Error:', error);
  });
}
