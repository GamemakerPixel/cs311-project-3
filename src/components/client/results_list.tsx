"use client"
import Image from "next/image"


interface ThumbnailRecipe{
  name: string,
  id: number,
  tags: {
    name: string
  }[],
  imagePath: string
}


// Image    Title                View Recipe Button
//          Tagged with

function Result(
  {
    recipe,
    redirectAction
  }:
  {
    recipe: ThumbnailRecipe
    redirectAction: (recipeId: number) => Promise<void>
  }
) {
  async function redirectToRecipe() {
    redirectAction(recipe.id)
  }

  return (
    <div className="flex items-center bg-darker_primary rounded-xl p-4 my-2">
      <Image
        src={recipe.imagePath}
        width={64}
        height={64}
        alt="Recipe thumbnail"
      />
      <div className="flex-grow">
        <p
          className="font-semibold"
        >{recipe.name}</p>
        <p
          className="text-sm italic"
        >{`Tagged with ${recipe.tags.map((tag: { name: string } ) => tag.name).join(", ")}`}</p>
      </div>
      <button className="small-button" onClick={redirectToRecipe}>
        View Recipe
      </button>
    </div>
  )
}


export default function ResultsList(
  {
    recipes,
    redirectAction
  }:
  {
    recipes: ThumbnailRecipe[]
    redirectAction: (recipeId: number) => Promise<void>
  }
) {
  return (
    <div>
      {recipes.map((recipe: ThumbnailRecipe, index: number) => (
        <Result recipe={recipe} redirectAction={redirectAction} key={index}/>
      ))}
    </div>
  )
}
