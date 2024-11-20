"use client"
import { useState } from "react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


export default function AddIngredientForm({ action }: { action: (data: FormData) => Promise<void>}) {
  const [revealed, setRevealed] = useState<boolean>(false);

  if (!revealed) {
    return (
      <div className="flex flex-col">
        <p className="text-center">
          Not enough ingredients for you? Want to spice up your recipes?
        </p>
        <button onClick={() => {setRevealed(true)}} className="default-button mx-auto">
          Add an ingredient!
        </button>
      </div>
    )
  }


  const formButtonClass = "mx-8 default-button"

  // Replace Tags input with a custom one later.
  return (
    <form className="flex flex-col" action={action}>
      <p className="text-center">Add an ingredient:</p>
      <Input label="Name:" name="name" placeholder="Name"/>
      <TagInput name="tags" minimumTags={1}/>
      <div className="flex justify-center">
        <button onClick={() => {setRevealed(false)}} type="button" className={formButtonClass}>
          Cancel
        </button>
        <button type="submit" className={formButtonClass}>
          Add
        </button>
      </div>
    </form>
  )
}
