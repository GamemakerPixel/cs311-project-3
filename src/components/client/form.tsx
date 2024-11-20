"use client"

import { useState } from "react"

import Input from "c@/client/input.tsx"


export interface InputData {
  label: string
  name: string
  placeholder: string
  validationFunction?: (value: string) => string
}


export function Form(
  { 
    inputs,
    action,
    submitText = "Submit"
  }: {
    inputs: InputData[],
    action: (data: FormData) => Promise<void>
    submitText?: string
  }) {

  const [submitting, setSubmitting] = useState<boolean>(false);

  function onFormSubmitted(event: SubmitEvent): void {
    event.preventDefault()


  }


  return (
    <form onSubmit={onFormSubmitted} className="flex flex-col">
      {inputs.map((inputData: InputData, index: number) => (
        <Input
          label={inputData.label}
          name={inputData.name}
          placeholder={inputData.placeholder}
          validationFunction={inputData.validationFunction}
          key={index}
          submitting={submitting}
        />
      ))}
      <button type="submit" className="default-button">{submitText}</button>
    </form>
  )
}

