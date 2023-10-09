
import multer from 'multer';

export const fileValidation = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
    file: ['application/pdf', 'application/msword'],
    video: ['video/mp4'],
    voice: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm'],
};

export function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        const allowedMimeTypes = [
            ...fileValidation.image,
            ...fileValidation.video,
            ...fileValidation.file,
            ...fileValidation.voice,
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb('Invalid file format', false);
        }
    }

    const upload = multer({ fileFilter, storage });

    return upload;
}