import path from 'path';

export const extensionLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files
         
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ status: "error", message: "No files uploaded." });
        }

        const fileExtensions = Object.keys(files).map(key =>
            path.extname(files[key].name).toLowerCase()
        );

        const allowed = fileExtensions.every(ext =>
            allowedExtArray.map(e => e.toLowerCase()).includes(ext)
        );

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.join(', ')} files are allowed.`;
            return res.status(422).json({ status: "error", message });
        }

        next();
    }
}

