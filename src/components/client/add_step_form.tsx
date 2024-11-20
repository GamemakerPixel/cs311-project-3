"use client"
import { useState } from "react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


export default function AddStepForm({ action }: { action: (data: FormData) => Promise<void>}) {
  const [revealed, setRevealed] = useState<boolean>(false);

  if (!revealed) {
    return (
      <div className="flex flex-col">
        <p className="text-center">
          Hmm. Perhaps you're more interested in the delicate art of changing how those
          ingredients are prepared.
        </p>
        <button onClick={() => {setRevealed(true)}} className="default-button mx-auto">
          Add a step!
        </button>
      </div>
    )
  }


  const formButtonClass = "mx-8 default-button"

  // Replace Tags input with a custom one later.
  return (
    <form className="flex flex-col" action={action}>
      <p className="text-center">Add a step:</p>
      <Input label="Step text:" name="text" placeholder="Mix [dry] and [wet]..."/>
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
