import Image from "next/image"

import LikeButton from "c@/client/like_button"
import { getRecipe, updateLikeCount, getLikeCount } from "@/src/util/server/database"
import { getRecipeImagePath } from "@/src/util/server/upload_manager"


function StepList( { steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col w-96 mx-auto items-center my-4 bg-darker_primary p-2 rounded-xl">
      <p className="font-semibold my-1">Steps:</p>
      <ul>
        {steps.map((step: string, index: number) => (
          <li
            key={index}
            className="text-center my-1"
          >
            {step}
          </li>
        ))}
      </ul>
    </div>
  )
}


export default async function Page({ params }: { params: {slug: Promise<string>} }) {
  const recipeId: number = parseInt((await params).slug)

  const recipe = await getRecipe(recipeId)
  const imagePath = await getRecipeImagePath(recipeId)


  async function likeAction(liked: boolean) {
    "use server"
    await updateLikeCount(recipeId, liked)
  }


  return (
    <div>
      <h1>
        {recipe.name}
      </h1>
      <Image
        src={imagePath}
        width={250}
        height={250}
        alt="Recipe thumbnail"
        className="mx-auto"
      />
      <StepList steps={recipe.steps.map((step: {text: string}) => step.text)} />
      <LikeButton action={likeAction} initialLikes={await getLikeCount(recipeId)}/>
    </div>
  )
}
