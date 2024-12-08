import { redirect } from "next/navigation"

import RecipeSearch from "c@/client/recipe_search"
import PaginatedNameBrowser from "c@/client/paginated_name_browser"
import ShowHide from "c@/client/show_hide"
import { getPage, searchRecipes } from "@/src/util/server/database"
import { parseTags } from "@/src/util/server/input_parsing"
import { getRecipeImagePath } from "@/src/util/server/upload_manager"

interface ThumbnailRecipe{
  name: string,
  id: number,
  tags: {
    name: string
  }[],
  imagePath: string
}

export default function Page() {
  async function findImagesForRecipes(recipes): ThumbnailRecipe[] {
    "use server"
    const imageCalls = recipes.map((recipe) => (
      getRecipeImagePath(recipe.id)
    ))

    const imagePaths = await Promise.all(imageCalls)
    console.log(imagePaths)

    return recipes.map((recipe, index: number) => {
      recipe.imagePath = imagePaths[index]
      return recipe
    })
  }


  async function search(current_state, data: FormData) {
    "use server"

    const tags = parseTags(data.get("tags"))
    const databaseResults = await searchRecipes(tags, data.get("title"))
    const searchResults: ThumbnailRecipe[] = await findImagesForRecipes(databaseResults)

    return searchResults
  }

  async function redirectAction(recipeId: number) {
    "use server"
    redirect(`/view/saved/${recipeId}`)
  }


  const tagPageItemCount = 3

  return (
    <div>
      <h1>Browse for Recipes</h1>
      <ShowHide
        showButtonText="Browse Avaliable Tags"
        hideButtonText="Close"
      >
        <PaginatedNameBrowser
          getNextPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, tagPageItemCount, "tag")
          }}
          getPreviousPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, -tagPageItemCount, "tag")
          }}
        />
      </ShowHide>
      <RecipeSearch action={search} redirectAction={redirectAction}/>
    </div>
  )
}
