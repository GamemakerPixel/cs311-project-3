import RecipeGenerator from "c@/client/recipe_generator"
import generateRecipe from "@/src/util/server/generate_recipe"


export default function Page() {
  return (
    <div>
      <RecipeGenerator
        generateAction={async (tags: string[], count: number) => {
          "use server"
          const result = await generateRecipe(count, tags)
          return result
        }}
        saveAction={async (data: FormData) => {
          "use server"
          const response = {
            title: "",
            tags: "",
          }

          console.log("- - - - - - Save Data - - - - - -")
          console.log(data)

          return response
        }}
      />
    </div>
  )
}
/*
*/
