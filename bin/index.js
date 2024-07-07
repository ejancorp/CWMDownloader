#!/usr/bin/env node

import { Command } from 'commander';
import auth from '../src/auth.js';

const program = new Command();

program
  .version('0.0.1')
  .usage('')
  .description('Download CodeWithMosh Videos');

program.command('auth')
  .description('Authenticate to CodeWithMosh using your cookie.')
  // .requiredOption('-c, --cookie <cookie>', 'Your CodeWithMosh Cookie')
  .requiredOption('-f --file <file>', 'Path of the file to be used to authenticate.')
  .action((options) => auth(options));

program.parse();

if (!process.argv.slice(2).length) {
  program.help();
}
