"use client"

import { useState } from "react"


const validationStepFunctions: {[stepName: string]: (input: string) => string} = {
  "not-empty": function(input: string) {
    if (!input) {
      return "This field is required."
    }

    return ""
  },
}


interface InputProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  initialValue?: string
  serverErrorMessage?: string
  validationSteps?: string[]
  validateInput?: (input: string) => string
  disabled?: boolean
  additionalProps?: {[propName: string]: any}
  inputClassOverride?: string
  labelClassOverride?: string
}


export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  initialValue = "",
  serverErrorMessage = "",
  validationSteps = [],
  validateInput = () => "",
  disabled = false,
  additionalProps = {},
  inputClassOverride = "",
  labelClassOverride = "",
}: InputProps) {
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Filtering object logic learned from https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
  // Modified to work for an array.
  const validationFunctions = Object.keys(validationStepFunctions).filter(
    (key: string) => validationSteps.includes(key)
  ).reduce((list, key) => {
    list.push(validationStepFunctions[key])
    return list
  }, []) 

  function runValidation(event: ChangeEvent | BlurEvent) {
    let messageCreated = false

    validationFunctions.forEach(
      (validationFunction) => {
        const message = validationFunction(event.target.value)
        if (message) {
          setErrorMessage(message)
          messageCreated = true
          return
        }
      }
    )

    if (messageCreated) {
      return
    }

    setErrorMessage(validateInput(event.target.value))
  }

  function onChanged(event: ChangeEvent) {
    if (!errorMessage) {
      return
    }
    
    runValidation(event)
  }

  function onBlurred(event: BlurEvent) {
    if (errorMessage) {
      return
    }

    runValidation(event)
  }

  function ErrorMessage({ message }: { message: string }): null | HTMLElement {
    if (!message) {
      return null
    }

    return (
      <p className="font-bold text-error">
        {message}
      </p>
    )
  }

  return (
    <label
      className={(labelClassOverride) ? labelClassOverride : "flex flex-col my-4 text-center"}
    >
      {label}
      <input
        name={name}
        placeholder={placeholder}
        defaultValue={initialValue}
        onBlur={onBlurred}
        onChange={onChanged}
        disabled={disabled}
        className={(inputClassOverride) ? inputClassOverride : "px-1 bg-darker_primary border-2 rounded-lg mx-auto mt-1 text-center"}
        {...additionalProps}
      />
      <ErrorMessage message={errorMessage}/>
      <ErrorMessage message={serverErrorMessage}/>
    </label>
  )
}
/*
*/
