// Using ECMAScript modules (import)
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your API key, secret, and cloud name

cloudinary.config({
  cloud_name: "dbqujitb1",
  api_key: "779544461378864",
  api_secret: "ihXY4qCJvOjHtCR7kGIhwiV28Qc",
});

// Upload the image to Cloudinary
export const Uploadimage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true, // Keep the original filename
    });
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const Deleteimage = async (publicId) => {
  try {
    // Attempt to delete the photo from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    // Check if deletion was successful
    if (result.result === "ok") {
      console.log(`Photo with public ID '${publicId}' deleted successfully.`);
    } else {
      console.error(`Failed to delete photo with public ID '${publicId}'.`);
    }
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error(`Error deleting photo with public ID '${publicId}':`, error);
  }
};
