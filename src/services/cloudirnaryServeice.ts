import { dev } from '../config';
import ApiError from '../errors/ApiError';
import { v2 as cloudinary } from 'cloudinary';

// Initialize Cloudinary with configuration
cloudinary.config({ 
  cloud_name: dev.cloud.cloudinaryName, 
  api_key: dev.cloud.cloudinaryApiKey, 
  api_secret: dev.cloud.cloudinaryApiSecret 
});

export const uploadToCloudinary = async (
  image: string,
  folderName: string
): Promise<string> => {
  try {
    const response = await cloudinary.uploader.upload(image, {
      folder: folderName,
    });
    return response.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

      export const valueWithoutExtension = async (
        imageUrl: string
      ): Promise<string> => {
        // Split the URL by slashes to get an array of path segments
        const pathSegments = imageUrl.split('/');

        // Get the last segment
        const lastSegment = pathSegments[pathSegments.length - 1];

        // Remove the file extension (.jpg) from the last segment
        const valueWithoutExtension = lastSegment.replace('.jpg', '');

        return valueWithoutExtension;
      };

      export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
        try {
          const response = await cloudinary.uploader.destroy(publicId);
          if (response.result !== 'ok') {
            throw ApiError.badRequest(400, 'image was not deleted from cloudinary')
          }
          console.log('image was deleted from cloudinary');
        } catch (error) {
          throw error;
        }
      };
