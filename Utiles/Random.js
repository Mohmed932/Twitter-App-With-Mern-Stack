import crypto from "crypto";

// Function to generate a random token
function generateRandomToken(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
}

export const GenerateToken = async () => {
  try {
    const token = await generateRandomToken(16);
    return token;
  } catch (err) {
    console.error("Error generating token:", err);
  }
};
