import { v4 as uuid } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import { Buffer } from 'buffer';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __imagesdir = path.join(__dirname, '../static/images');

const imageSavingMiddleware = async (req, res, next) => {
  try {
    if (!req.body.image) {
      res.status(400).json({
        message: "Request needs a key 'image' with value in base64",
      });
      return;
    }

    const buffer = Buffer.from(req.body.image, 'base64');
    const extensionName = await fileTypeFromBuffer(buffer);
    const imageFilename = uuid() + '.' + extensionName.ext;
    const imagePath = path.join(__imagesdir, imageFilename);

    if (!['jpg', 'jpeg', 'png', 'tiff', 'webp'].includes(extensionName.ext)) {
      res.status(400).json({
        message:
          'Invalid image format. Valid extensions: .jpg, .jpeg, .png, .tiff, .webp',
      });
      return;
    }
    fs.writeFileSync(imagePath, buffer);

    console.log(`Saved image ${imageFilename} at ${__imagesdir}`);
    req.uuid = imageFilename;
    next();
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error ocurred' });
    console.log(error);
  }
};

export default imageSavingMiddleware;
