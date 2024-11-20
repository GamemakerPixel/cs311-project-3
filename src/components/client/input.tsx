"use client"

import { useState } from "react"

interface InputProps {
  label: string
  name: string
  placeholder?: string
  validateInput?: (input: string) => string
}


export default function Input({
  label,
  name,
  placeholder = "",
  validateInput = () => "",
}: InputProps) {
  const [errorMessage, setErrorMessage] = useState<string>("")

  function onChanged(event: ChangeEvent) {
    if (!errorMessage) {
      return
    }

    setErrorMessage(validateInput(event.target.value))
  }

  function onBlurred(event: BlurEvent) {
    if (errorMessage) {
      return
    }

    setErrorMessage(validateInput(event.target.value))
  }

  function ErrorMessage(): null | HTMLElement {
    if (!errorMessage) {
      return null
    }

    return (
      <p className="font-bold text-error">
        {errorMessage}
      </p>
    )
  }

  return (
    <label className="flex flex-col my-4 text-center">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        onBlur={onBlurred}
        onChange={onChanged}
        className="px-1 bg-darker_primary border-2 rounded-lg mx-auto mt-1"
      />
      <ErrorMessage />
    </label>
  )
}
