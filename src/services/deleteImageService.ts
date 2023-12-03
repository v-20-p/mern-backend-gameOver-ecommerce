import fs from 'fs/promises'

export const deleteImage = async (imagePath: string) => {
  try {
    if (imagePath == '') {
      return
    }
    await fs.unlink(imagePath)
    console.log('Image is deleted from server')
  } catch (error) {
    console.log(error)
    throw error
  }
}
