import { spawn, exec as execCallback } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs';

const exec = promisify(execCallback);
const directoryPath = './updatedExcels';

function createDirectoryIfNotExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
    console.log(`Directory created: ${directoryPath}`);
  } else {
    console.log(`Directory already exists: ${directoryPath}`);
  }
}

async function isPackageInstalled(packageName) {
  try {
    await exec(`pip show ${packageName}`);
    return true;
  } catch {
    return false;
  }
}

async function installPackage(packageName) {
  try {
    await exec(`pip install ${packageName}`);
    console.log(`${packageName} package installed successfully.`);
  } catch (error) {
    console.error(`Failed to install ${packageName} package: ${error}`);
  }
}

async function ensurePackageInstalled(packageName) {
  const isInstalled = await isPackageInstalled(packageName);
  if (!isInstalled) {
    console.log(`${packageName} package is not installed. Installing...`);
    await installPackage(packageName);
  }
}

export async function createBranches(data) {
  createDirectoryIfNotExists(directoryPath);
  await ensurePackageInstalled('openpyxl');

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['CreateBranch.py']);
    
    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(code);
    });

    pythonProcess.on('error', (error) => {
      console.error(`child process encountered an error: ${error}`);
      reject(error);
    });
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
  });
}
