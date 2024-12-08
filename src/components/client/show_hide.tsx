"use client"

import { useState, PropsWithChildren } from "react"
import { motion } from "motion/react"

import { defaultButtonAnim, fadeInChildren } from "@/src/util/client/animations"


export default function ShowHide(
  {
    children,
    hintText,
    showButtonText,
    hideButtonText
  }:
  PropsWithChildren<{
    hintText: string,
    showButtonText: string,
    hideButtonText: string
  }>
) {
  const [revealed, setRevealed] = useState<boolean>(false);

  if (revealed) {
    return (
      <motion.div
        className="flex flex-col"
        {...fadeInChildren.parent}
      >
        {children}
        <motion.button
          onClick={() => {setRevealed(false)}}
          type="button"
    className="mx-auto small-button min-w-32"
          {...fadeInChildren.child}
          {...defaultButtonAnim}
        >
          Cancel
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col">
      <p className="text-center">
        {hintText}
      </p>
      <motion.button
        onClick={() => {setRevealed(true)}}
        className="small-button mx-auto"
        {...defaultButtonAnim}
      >
        {showButtonText}
      </motion.button>
    </div>
  )
}
