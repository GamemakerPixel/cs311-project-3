"use client"
import Input from "c@/client/input"


export default function ImageInput(
  {
    name,
    serverErrorMessage,
    disabled,
  }
){
  return (
    <Input 
      name={name}
      label="Add an image:"
      serverErrorMessage={serverErrorMessage}
      disabled={disabled}
      additionalProps={{
        type: "file",
        accept: ".png,.jpg,.jpeg,.svg"
      }}
      inputClassOverride="mx-auto file:py-1 file:px-2 file:my-2 file:border-2 file:rounded-lg file:bg-darker_primary file:text-text file:inline-block"
    />
  )
}

/*
{
    name,
    serverErrorMessage = "",
    disabled = false,
  }): {
    name: string
    serverErrorMessage?: string
    disabled?: boolean
  }
*/
