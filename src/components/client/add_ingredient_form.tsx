"use client"
import { useState, useActionState, useRef, useEffect, startTransition } from "react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


export default function AddIngredientForm({ action }: { action: (data: FormData) => Promise<void>}) {
  const [serverErrors, formAction, pending] = useActionState(action, {"name": "", "tags": ""})
  const [revealed, setRevealed] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!formRef.current) {
      return
    }

    let errorFlag = false

    Object.keys(serverErrors).forEach((key) => {
      console.log(serverErrors)
      if (serverErrors[key]) {
        errorFlag = true
        return
      }
    })

    if (errorFlag) {
      return
    }

    formRef.current.reset()
  }, [serverErrors])

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

  function onSubmitted(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current)

    startTransition(() => {
      formAction(data)
    })
  }

  const formButtonClass = "mx-8 default-button"

  // Replace Tags input with a custom one later.
  return (
    <form className="flex flex-col" ref={formRef} onSubmit={onSubmitted}>
      <p className="text-center">Add an ingredient:</p>
      <Input
        label="Name:"
        name="name"
        placeholder="Name"
        validationSteps={["not-empty"]}
        serverErrorMessage={(pending) ? "" : serverErrors["name"]}
        disabled={pending}
      />
      <TagInput
        name="tags"
        minimumTags={1}
        serverErrorMessage={(pending) ? "" : serverErrors["tags"]}
        disabled={pending}
      />
      <div className="flex justify-center">
        <button
          onClick={() => {setRevealed(false)}}
          type="button"
          className={formButtonClass}
          disabled={pending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={formButtonClass}
          disabled={pending}
        >
          Add
        </button>
      </div>
    </form>
  )
}
