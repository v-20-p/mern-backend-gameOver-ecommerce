import fs from "fs/promises";

export const deleteImage = async (imagePath: string) => {
  try {
    await fs.unlink(imagePath);
  } catch (error) {
    throw error;
  }
};
