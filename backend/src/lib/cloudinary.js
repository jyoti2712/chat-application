
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";


config();

cloudinary.config({
    cloud_name: 'duwabybme',
    api_key: '463936138339787',
    api_secret: 'DwR7Uk5vniyiPUuJdtbcGLqz5q0',
    verbose: true,
})
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);
export default cloudinary;