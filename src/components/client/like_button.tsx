"use client"
import { useEffect, useState } from "react"
import { motion } from "motion/react"


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
    <motion.div
      className="flex items-center justify-center font-semibold"
      initial={{
        rotate: 0,
        color: "#efece6"
      }}
      whileHover={{
        rotate: [0, 3, -3, 0],
        color: ["#efece6", "#f82866", "#f82866", "#efece6"]
      }}
      transition={{
        duration: 0.6,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6]
      }}
    >
      <span>
        Likes: {likeCount}
      </span>
      <button
        className="small-button ml-4"
        onClick={() => setLiked(!liked)}
      >
        {(liked) ? "Unlike" : "Like"}
      </button>
    </motion.div>
  )
  
}
