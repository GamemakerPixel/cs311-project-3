const functionOpen = "["
const functionClose = "]"


export interface ErrorResponse {
  [inputName: string]: string
}


export function parseTags(input: string): string[] {
  const tagDelimiter = ","

  const splitTags = input.split(tagDelimiter)
  return splitTags.filter((tag) => tag != "")
}


export function getFunctionsFromStep(step: string): string[] {
  let functionIsOpen = false
  let openIndex = -1
  let functions: string[] = []

  for (let i = 0; i < step.length; i++) {
    const char = step.charAt(i)
    if (!functionIsOpen && char == functionOpen) {
      openIndex = i
      functionIsOpen = true
    }
    else if (functionIsOpen && char == functionClose) {
      functions.push(step.substring(openIndex + 1, i))
      functionIsOpen = false
    }
  }

  return functions
}


export function isBlank(input: string): Boolean {
  return !input
}


export function tagCountLessThan(input: string, count: number): Boolean {
  return parseTags(input).length < count
}


// Example cases: "[text]":false, "[[text]":true, "[text]]":true, "]":true
export function stepHasUnclosedFunction(input: string): Boolean {
  let openFunctions = 0

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i)

    if (char == functionOpen) {
      openFunctions += 1
    }
    else if (char == functionClose) {
      openFunctions -= 1
      if (openFunctions < 0) {
        return true
      }
    }
  }

  if (openFunctions > 0) {
    return true
  }

  return false
}

export function stepHasNestedFunction(input: string): Boolean {
  let functionIsOpen = false

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i)

    if (char == functionOpen) {
      if (functionIsOpen) {
        return true
      }
      functionIsOpen = true
    }
    else if (char == functionClose) {
      functionIsOpen = false
    }
  }
}

export function isNotANumber(input: string): Boolean {
  const number = parseInt(input)

  return isNaN(number)
}
