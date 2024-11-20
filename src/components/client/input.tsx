"use client"

import { useState } from "react"

interface InputProps {
  label: string
  name: string
  placeholder: string
  validationFunction?: (value: string) => string
}


export default function Input({
  label,
  name,
  placeholder,
  validationFunction = (value: string) => ""
}: InputProps) {
  const [message, setMessage] = useState<string>("")
  
  async function onInputDeselected(event: BlurEvent): void {
    if (message) {
      return
    }
    const value: string = event.target.value
    const response: string = await validationFunction(value)
    setMessage(response)
  }

  async function onInputChanged(event: ChangeEvent): void {
    if (!message) {
      return
    }
    const value: string = event.target.value
    const response: string = await validationFunction(value)
    setMessage(response)
  }

  function ErrorMessage(): null | HTMLElement {
    if (!message) {
      return null
    }

    return (
      <span className="font-bold text-error">
        {message}
      </span>
    )
  }

  return (
    <label className="flex flex-col my-4 text-center">
      {label}
      <input
        name={name}
        placeholder={placeholder}
        onBlur={onInputDeselected}
        onChange={onInputChanged}
        className="px-1 bg-darker_primary border-2 rounded-lg mx-auto mt-1"
      />
      <ErrorMessage />
    </label>
  )
}
