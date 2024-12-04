"use client"

import Input from "c@/client/input"

// Ideally this component gains the ability to search for 
// tags on the database and add them through buttons, but
// it is not required so I'm starting with the minimum.
export default function TagInput(
  {
    name,
    label = "Tags:",
    placeholder = "tag1,tag2,tag3",
    minimumTags = 0,
    notEnoughTagsMessage = "",
    serverErrorMessage = "",
    disabled = false
  }: {
    name: string,
    label?: string
    placeholder?: string
    minimumTags?: number,
    notEnoughTagsMessage?: string,
    serverErrorMessage?: string,
    disabled?: boolean
  }
) {
  const defaultNotEnoughTagsMessage = `You must have at least ${minimumTags} tags.`
  const tagDelimiter = ","
  function validateTags(tagsInput: string): string {
    const tagsList = tagsInput.split(tagDelimiter).filter((tag: string) => tag != "")

    if (tagsList.length < minimumTags) {
      return (notEnoughTagsMessage) ? notEnoughTagsMessage : defaultNotEnoughTagsMessage
    }

    return ""
  }

  return (
    <Input
      label={label}
      name={name}
      placeholder={placeholder}
      validateInput={validateTags}
      serverErrorMessage={serverErrorMessage}
      disabled={disabled}
    />
  )
  
}
