"use client"
import Image from "next/image"
import { motion } from "motion/react"
import Link from "next/link"

import { defaultButtonAnim } from "@/src/util/client/animations"


export default function Home() {
  return (
    <div>
      <Image 
      src="/logo.svg"
      width={256}
      height={256}
      alt="Large Mythical Meals logo"
      className="mx-auto my-8"
      />
      <h1 className="text-accent text-6xl text-center">Mythical Meals</h1>
      <p className="text-center">
        Welcome to Mythical Meals, the site where food meets
        <span className="italic mx-1 text-accent">magic.</span>
      </p>
      <motion.button
        className="default-button block mx-auto"
        {...defaultButtonAnim}
      >
        <Link href="/generate">
          Get started by generating a recipe!
        </Link>
      </motion.button>
    </div>
  )
}
