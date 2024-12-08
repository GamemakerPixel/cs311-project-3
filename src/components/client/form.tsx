"use client"
import { useState, useActionState, useRef, useEffect, startTransition } from "react"
import { motion } from "motion/react"

import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"
import ImageInput from "c@/client/image_input"
import { ErrorResponse } from "@c/server/input_parsing"
import { defaultButtonAnim, fadeInChildren } from "@/src/util/client/animations"


interface InputData {
  type: string
  name: string
  props: {[prop: string]: any}
}


export default function Form(
  {
    action,
    inputs,
    buttonText,
    header = "",
    hiddenData = {},
  }: {
    action: (data: FormData) => Promise<ErrorResponse>
    inputs: InputData[]
    buttonText: string
    header?: string
    hiddenData?: {[field: string]: string}
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
    <motion.form
      className="flex flex-col"
      ref={formRef}
      onSubmit={onSubmitted}
      {...fadeInChildren.parent}
    >
      <motion.p
        className="text-center"
        {...fadeInChildren.child}
      >
        {header}
      </motion.p>
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
          case "image":
            return <ImageInput
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
      <motion.button
        type="submit"
        className={formButtonClass}
        disabled={pending}
        {...defaultButtonAnim}
        {...fadeInChildren.child}
      >
      {buttonText}
      </motion.button>

      {Object.keys(hiddenData).map((key: string, index: number) => {
        if (hiddenData[key]){
          return (
            <input name={key} key={index} value={hiddenData[key]} type="hidden" />
          )
        }
      })}
    </motion.form>
  )
}
