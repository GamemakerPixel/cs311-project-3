import { redirect } from "next/navigation"

import RecipeGenerator from "c@/client/recipe_generator"
import generateRecipe from "@/src/util/server/generate_recipe"
import { addRecipe } from "@/src/util/server/database"
import {
  tagCountLessThan,
  isBlank,
  containsError,
  parseTags,
} from "@/src/util/server/input_parsing"
import { uploadFile } from "@/src/util/server/upload_manager"


export default function Page() {


  async function submitSaveForm(current_state, data: FormData) {
    "use server"

    function validateSaveForm(data: FormData): {[input: string]: string} {
      const response = {
        title: "",
        tags: "",
      }

      if (tagCountLessThan(data.get("tags"), 1)) {
        response["tags"] = "You must add at least one tag."
      }

      if (isBlank(data.get("title"))) {
        response["title"] = "You must title your recipe first!"
      }

      const imageInput = data.get("image")
      const maxFileSize = 1024 * 1024 // 1 MiB

      // I'm pretty sure a client could manipulate this data to lie about the
      // file size, so this could be a security hole - but it works for this
      // project.
      // Actually, files of this size are causing a network errors for the time being,
      // React already imposes a 1MB limit on the body of server actions.
      if (imageInput.size > maxFileSize) {
        response["image"] = "File size must be under 1 MiB."
      }

      return response
    }

      const response = validateSaveForm(data)

      if (!containsError(response)) {
        const recipeId = await addRecipe(
          data.get("title"),
          parseTags(data.get("tags")),
          data.get("steps").split("\r\n")
        )

        await uploadFile(data.get("image"), recipeId)

        redirect(`/view/saved/${recipeId}`)
      }

      return response
    }


  return (
    <div>
      <RecipeGenerator
        generateAction={async (tags: string[], count: number) => {
          "use server"
          const result = await generateRecipe(count, tags)
          return result
        }}
        saveAction={submitSaveForm}
      />
    </div>
  )
}
/*
*/
