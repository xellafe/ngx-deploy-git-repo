import { logging } from '@angular-devkit/core';
import {
  access,
  constants,
  mkdtempSync,
  readdirSync,
  rm,
  rmdirSync,
  statSync,
  unlinkSync
} from 'fs';

import { execSync } from 'child_process';
import { copy } from 'fs-extra';
import { join } from 'path';
import { Schema } from '../deploy/schema';
import { defaults } from './defaults';

// TODO: add your deployment code here!
export async function run(
  dir: string,
  options: Schema,
  logger: logging.LoggerApi
) {
  try {
    await checkOptions(options);
    await checkIfDistFolderExists(dir);

    await deployToGit(logger, options, dir);

    logger.info(
      '🌟 Successfully published via ngx-deploy-git-repo! Have a nice day!'
    );
  } catch (error) {
    throw error;
  }
}

async function deployToGit(
  logger: logging.LoggerApi,
  options: Schema,
  dir: string
) {
  const tempDir = mkdtempSync('git-deploy-');
  process.chdir(tempDir);

  let repo = options.repo;

  try {
    logger.info(`🚀 Deploying to ${repo}..`);
    if (options.oauthPac) {
      logger.info(`💻 Personal Access Token provided, converting URL..`);
      repo = repo.replace('https://', `https://oauth2:${options.oauthPac}@`);
    }

    logger.info(
      `💻 Cloning repository ${repo} into temporary directory ${tempDir}`
    );
    execSync(`git clone -n ${repo} project`);
    process.chdir('project');

    if (
      !execSync(`git branch --list ${options.branch}`).toString() &&
      !execSync(`git ls-remote --heads origin ${options.branch}`).toString()
    ) {
      logger.info(`Branch ${options.branch} not found. Creating..`);
      execSync(`git switch -c ${options.branch}`);
    } else {
      execSync(`git switch ${options.branch}`);
    }

    await deleteFolderContentSync('./');

    await copyFolderContents(`../../${dir}`, './');

    execSync(`git add .`);

    execSync(
      `git commit -m "${options.message}" ${options.name ? `--author="${options.name} <${options.email}>"` : ''}`
    );

    execSync(`git push origin ${options.branch}`);
  } catch (error) {
    throw error;
  } finally {
    process.chdir('../..');
    logger.info(`💻 Cleaning up temporary directory ${tempDir}`);
    rm(tempDir, { recursive: true }, () => {});
  }
}

async function checkIfDistFolderExists(dir: string) {
  access(dir, constants.F_OK, err => {
    if (err) {
      throw new Error(
        'Dist folder does not exist. Check the dir --targetDir parameter or build the project first!'
      );
    }
  });
}

async function checkOptions(options: Schema) {
  if (!options.repo) {
    throw new Error('No repo url provided!');
  }
  if (!options.branch) options.branch = defaults.branch;
  if (!options.message) options.message = defaults.message;
  if (options.name && !options.email)
    throw new Error('Email is required when providing a name');
  if (!options.name && options.email)
    throw new Error('Name is required when providing an email');
}

async function deleteFolderContentSync(folderPath: string) {
  const files = readdirSync(folderPath);

  files.forEach(file => {
    if (file.startsWith('.git')) return; // Salta la catella .git

    const filePath = join(folderPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      deleteFolderContentSync(filePath); // Rimuove il contenuto della cartella
      rmdirSync(filePath); // Rimuove la cartella vuota
    } else {
      unlinkSync(filePath); // Rimuove il file
    }
  });
}

async function copyFolderContents(source: string, destination: string) {
  try {
    await copy(source, destination);
  } catch (err) {
    throw err;
  }
}
