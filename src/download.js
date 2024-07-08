import fs from 'fs';
import ora from "ora";
import chalk from "chalk";
import inquirer from 'inquirer';
import CourseListing from './modules/CourseListing.js';
import CurlHelper from './helpers/CurlHelper.js';
import Settings from './helpers/Settings.js';
import CourseContent from './modules/CourseContent.js';

export default async function download(options) {

  await Settings.read();

  const file = fs.readFileSync(options.file, 'utf8');
  const { method, headers, body } = CurlHelper.parse(file);

  const listingSpinner = ora(chalk.yellow(`Getting the list of available courses...`)).start();
  const courses = await CourseListing({ method, headers, body });
  listingSpinner.succeed(chalk.green(`Here are the available courses:`));

  const courseAnswer = await inquirer.prompt({
    type: 'list',
    name: 'likedItem',
    message: 'Which course do you like?',
    choices: courses
  }).then(answers => {
    return answers;
  }).catch(error => {
    console.error('Error:', error);
  });

  console.log(chalk.blue(`You've selected course: ${courseAnswer.likedItem}`));

  const sectionSpinner = ora(chalk.yellow(`Getting the content of ${courseAnswer.likedItem}...`)).start();
  const sections = await CourseContent(courseAnswer.likedItem, { method, headers, body });
  sectionSpinner.succeed(chalk.green(`Here are the available sections:`));
  console.log(sections);
  const sectionAnswer = await inquirer.prompt({
    type: 'list',
    name: 'likedItem',
    message: 'Which section do you like?',
    choices: sections
  }).then(answers => {
    return answers;
  }).catch(error => {
    console.error('Error:', error);
  });

  console.log(chalk.blue(`You've selected section: ${sectionAnswer.likedItem}`));
}
