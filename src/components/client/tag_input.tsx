"use client"

import Input from "c@/client/input"

// Ideally this component gains the ability to search for 
// tags on the database and add them through buttons, but
// it is not required so I'm starting with the minimum.
//
// Looking back at this now, there's got to be a better way
// to prop drill than this.
export default function TagInput(
  {
    name,
    label = "Tags:",
    placeholder = "tag1, tag2, tag3",
    initialValue = "",
    minimumTags = 0,
    maximumTags = 9999,
    incorrectTagCountMessage = "",
    serverErrorMessage = "",
    disabled = false,
    inputClassOverride = "",
    labelClassOverride = "",
  }: {
    name: string
    label?: string
    placeholder?: string
    initialValue?: string
    minimumTags?: number
    maximumTags?: number
    incorrectTagCountMessage?: string
    serverErrorMessage?: string
    disabled?: boolean
    inputClassOverride?: string
    labelClassOverride?: string
  }
) {
  const defaultIncorrectTagCountMessage = `You must have between ${minimumTags} and ${maximumTags} tags.`
  const tagDelimiter = ","
  function validateTags(tagsInput: string): string {
    const tagsList = tagsInput.split(tagDelimiter).filter((tag: string) => tag != "")

    if (tagsList.length < minimumTags || tagsList.length > maximumTags) {
      return (incorrectTagCountMessage) ? incorrectTagCountMessage : defaultIncorrectTagCountMessage
    }

    return ""
  }

  return (
    <div>
      <Input
        label={label}
        name={name}
        placeholder={placeholder}
        initialValue={initialValue}
        validateInput={validateTags}
        serverErrorMessage={serverErrorMessage}
        disabled={disabled}
        inputClassOverride={inputClassOverride}
        labelClassOverride={labelClassOverride}
      />
    </div>
  )
  
}
