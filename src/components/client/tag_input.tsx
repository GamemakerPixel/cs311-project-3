"use client"

import Input from "c@/client/input"

// Ideally this component gains the ability to search for 
// tags on the database and add them through buttons, but
// it is not required so I'm starting with the minimum.
export default function TagInput(
  {
    name,
    minimumTags = 0,
    serverErrorMessage = "",
    disabled = false
  }: {
    name: string,
    minimumTags?: number,
    serverErrorMessage?: string,
    disabled?: boolean
  }
) {
  const tagDelimiter = ","
  function validateTags(tagsInput: string): string {
    const tagsList = tagsInput.split(tagDelimiter).filter((tag: string) => tag != "")

    if (tagsList.length < minimumTags) {
      const pluralCharacter = (minimumTags == 1) ? "" : "s"
      return `You must have at least ${minimumTags} tag${pluralCharacter}.`
    }

    return ""
  }

  return (
    <Input
      label="Tags:"
      name="tags"
      placeholder="tag1,tag2,tag3"
      validateInput={validateTags}
      serverErrorMessage={serverErrorMessage}
      disabled={disabled}
    />
  )
  
}
