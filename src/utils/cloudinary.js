// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


export const uploadToCloudinary = async(file,folder,public_id = undefined) => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type;
  const isVideo = mimeType.startsWith('video');
    const uploadOptions = {
      folder,
      resource_type: "auto",
      public_id,
      quality: "auto", // Auto quality optimization
      fetch_format: "auto", // Auto format optimization
      overwrite: true,
      transformation: isVideo
        ? [
            { quality: "auto" },
            { fetch_format: "auto" },
            { streaming_profile: "full_hd" }, // Optional: for adaptive streaming
          ]
        : [
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
    }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.public_id);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // Signifies the end of the stream
    readableStream.pipe(stream);
  });
};