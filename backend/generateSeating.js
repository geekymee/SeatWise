import { spawn } from 'child_process';

export async function generateSeating(data) {
    return new Promise((resolve, reject) => {
       
        const pythonProcess = spawn('python', ['generateSeating.py']);

        let output = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (chunk) => {
            output += chunk.toString();
        });

        pythonProcess.stderr.on('data', (chunk) => {
            errorOutput += chunk.toString();
        });
        console.log(output);
        console.log(errorOutput);

        pythonProcess.on('close', (code) => {
            if (code === 0) {
              resolve(output.trim());
              console.log(output);
            } else {
              reject(new Error(`Python process exited with code ${code}\n${errorOutput}`));
              console.log(errorOutput);

            }
        });

        pythonProcess.on('error', (err) => {
            reject(new Error(`Failed to start Python process: ${err.message}`));
        });

    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
    });
}

