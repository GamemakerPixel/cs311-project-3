"use client"
import Image from "next/image"
import { startTransition } from "react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


export default function RecipeSearchBar(
  {
    action,
  }:
  {
    action: (data: FormData) => Promise<void>
  }
) {

  function callActionNoClear(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(event.target)
    startTransition(() => {
      action(data)
    })
  }


  const labelClassOverride = "flex text-center items-center"
  const inputClassOverride = "px-1 bg-darker_primary border-2 rounded-lg mx-2 mt-1 text-center"
  
  return (
    <form
      onSubmit={callActionNoClear}
      className="flex flex-wrap justify-center items-center"
    >
      <Input
        name="title"
        label="Search in title:"
        labelClassOverride={labelClassOverride}
        inputClassOverride={inputClassOverride}
      />
      <TagInput
        name="tags"
        label="With any of these tags:"
        labelClassOverride={labelClassOverride}
        inputClassOverride={inputClassOverride}
      />
      <button
        type="submit"
        className="small-button text-accent font-semibold"
      >
        <span
          className="mr-2"
        >Search</span>
        <Image
          src="/search_icon.svg"
          width={16}
          height={16}
          alt="Search icon"
          className="inline-block"
        />
      </button>
    </form>
  )
}
