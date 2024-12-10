import { writeFile, access, constants, mkdir, readdir } from "fs/promises"
import { join, extname } from "path"

const uploadPath = join("public", "uploads")
const accessPath = "/uploads"
const defaultFile = "/recipe_default.svg"


// Based on https://www.youtube.com/watch?v=-_bhH4MLq1Y
export async function uploadFile(file: File, recipeId: number) {
  // If the user doesn't provide a file, don't try to upload one.
  if (file.size == 0) {
    return
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const directory = join(uploadPath, recipeId.toString())
  await mkdir(directory, { recursive: true })
  const filepath = join(directory, file.name)
  await writeFile(filepath, buffer)
}


export async function getRecipeImagePath(recipeId: number) {
  try {
    const expectedImageDirectory = join(uploadPath, recipeId.toString())
    const directoryContents = await readdir(expectedImageDirectory)
    return join(accessPath, recipeId.toString(), directoryContents[0])
  }
  catch {
    return defaultFile
  }
}
