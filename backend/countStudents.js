import { spawn } from 'node:child_process';

const totalCount = async (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['countStudents.py']);

        let result = '';

        
        pythonProcess.stdout.on('data', (chunk) => {
            result += chunk.toString();
        });

        pythonProcess.stderr.on('data', (err) => {
            reject(err.toString());
        });

        
        pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            console.log(`Result: ${result}`);
            if (code === 0) {
                const parsedResult = parseInt(result, 10);
                if (!isNaN(parsedResult)) {
                    resolve(parsedResult);
                } else {
                    reject('Invalid output format from Python script');
                }
            } else {
                reject(`Python script exited with code ${code}`);
            }
        });

        pythonProcess.on('error', (error) => {
            console.error(`child process encountered an error: ${error}`);
            reject(error);
        });
        pythonProcess.stdin.write(JSON.stringify(data));
        pythonProcess.stdin.end();
    });
}

export default totalCount;