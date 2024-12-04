"use client"
import { useState, useActionState, useRef, useEffect, startTransition } from "react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


interface InputData {
  type: string
  name: string
  props: {[prop: string]: any}
}


export default function Form(
  {
    action,
    inputs,
    buttonText
  }: {
    action: (data: FormData) => Promise<void>
    inputs: InputData[]
    buttonText: string
  }) {
  const [serverErrors, formAction, pending] = useActionState(action, {"name": "", "tags": ""})
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!formRef.current) {
      return
    }

    let errorFlag = false

    Object.keys(serverErrors).forEach((key) => {
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

  function onSubmitted(event: SubmitEvent) {
    event.preventDefault()
    const data = new FormData(formRef.current)

    startTransition(() => {
      formAction(data)
    })
  }

  const formButtonClass = "mx-auto default-button min-w-32"

  return (
    <form className="flex flex-col" ref={formRef} onSubmit={onSubmitted}>
      <p className="text-center">Add an ingredient:</p>
      {inputs.map((input: InputData, index: number) => {
        switch (input.type) {
          case "text":
            return <Input
              {...input.props}
              name={input.name}
              serverErrorMessage={(pending) ? "" : serverErrors[input.name]}
              disabled={pending}
              key={index}
            />
          case "tags":
            return <TagInput
              {...input.props}
              name={input.name}
              serverErrorMessage={(pending) ? "" : serverErrors[input.name]}
              disabled={pending}
              key={index}
            />
          default:
            return <p key={index}>Invalid type: {input.type}</p>
        }
      })}
      <button
        type="submit"
        className={formButtonClass}
        disabled={pending}
      >
      {buttonText}
      </button>
    </form>
  )
}
