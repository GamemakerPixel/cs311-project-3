"use client"
import { useActionState, useState, useEffect } from "react"

import ResultsList from "c@/client/results_list"
import RecipeSearchBar from "c@/client/recipe_search_bar"
import PaginatedNameBrowser from "c@/client/paginated_name_browser"


interface ThumbnailRecipe{
  name: string,
  id: number,
  tags: {
    name: string
  }[],
  imagePath: string
}


function SearchStatus(
  {
    resultCount,
    pending,
  }:
  {
    resultCount: number
    pending: boolean
  }
) {
  const pendingMessage = "Results are loading..."
  const resultsMessage = `Found ${resultCount} recipes matching your search.`

  const [searchedOnce, setSearchedOnce] = useState<boolean>(false)

  useEffect(() => {
    if (pending && !searchedOnce) {
      setSearchedOnce(true)
    } 
  }, [pending])

  
  if (!searchedOnce) {
    return
  }


  return (
    <p
      className="font-semibold text-center"
    >{(pending) ? pendingMessage : resultsMessage}</p>
  )
}


export default function RecipeSearch(
  {
    action,
    redirectAction,
  }:
  {
    action: (data: FormData) => Promise<ThumbnailRecipe[]>
    redirectAction: (recipeId: number) => Promise<void>
  }
) {
  const [results, searchAction, pending] = useActionState(action, [])

  const tagPageItemCount = 3
  return (
    <div>
      <RecipeSearchBar action={searchAction}/>
      <SearchStatus resultCount={results.length} pending={pending} />
      <ResultsList recipes={results} redirectAction={redirectAction} />
    </div>
  )

}
