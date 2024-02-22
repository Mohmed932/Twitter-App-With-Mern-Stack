// Using ECMAScript modules (import)
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your API key, secret, and cloud name

cloudinary.config({
  cloud_name: "dbqujitb1",
  api_key: "779544461378864",
  api_secret: "ihXY4qCJvOjHtCR7kGIhwiV28Qc",
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: `process.env.CLOUDINARY_API_SECRET,
//   api_secret: process.env.CLOUDINARY_API_KEY,
// });

// Upload the image to Cloudinary
export const Uploadimage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      use_filename: true, // Keep the original filename
    });
    // console.log("Upload successful:", result);
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

export const DeletePhotos = async (photoPublicIds) => {
  try {
    const deletionResults = await Promise.all(
      photoPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );

    deletionResults.forEach((result) => {
      if (result.result === "ok") {
        console.log(
          `Successfully deleted photo with public ID: ${result.public_id}`
        );
      } else {
        console.error(
          `Failed to delete photo with public ID: ${result.public_id}`
        );
      }
    });
  } catch (error) {
    console.error("Error deleting photos:", error);
  }
};
