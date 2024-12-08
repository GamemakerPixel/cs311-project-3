"use client"
import { useEffect, useState } from "react"


export default function LikeButton(
  {
    action,
    initialLikes
  }:
  {
    action: (liked: boolean) => Promise<void>
    initialLikes: number
  }
) {
  const [likeCount, setLikeCount] = useState<number>(initialLikes)
  const [liked, setLiked] = useState<boolean>(false)

  useEffect(() => {
    // Workaround preventing first (and second when redirected) render
    // from unliking the recipe without liking it first.
    const newLikeCount = likeCount + ((liked) ? 1 : -1)
    if (newLikeCount < initialLikes) {
      return
    }

    setLikeCount(newLikeCount)

    async function callLikeAction() {
      await action(liked)
    }

    callLikeAction()
  }, [liked])

  return (
    <div className="flex items-center justify-center font-semibold">
      <span>
        Likes: {likeCount}
      </span>
      <button
        className="small-button ml-4"
        onClick={() => setLiked(!liked)}
      >
        {(liked) ? "Unlike" : "Like"}
      </button>
    </div>
  )
  
}
