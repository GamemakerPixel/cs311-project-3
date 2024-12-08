"use client"
import Form from "c@/client/form"
import { ErrorResponse } from "c@/server/input_parsing"


export default function AddIngredientForm({ action }: { action: (data: FormData) => Promise<ErrorResponse>}) {
  function validateStepCount(input: string): string {
    if (!input) {
      return "Please enter the number of steps you want."
    }

    const count = parseInt(input)

    if (isNaN(count)) {
      return "The step count must be a number."
    }

    if (count == 0) {
      return "You cannot generate a recipe with no steps!"
    }

    return ""
  }

  return (
    <Form
      action={action}
      buttonText="Generate!"
      inputs={[
        {
          type: "text",
          name: "steps",
          props: {
            label: "Number of steps:",
            placeholder: "3, 5, 7",
            validateInput: validateStepCount,
          }
        },
        {
          type: "tags",
          name: "tags",
          props: {
            minimumTags: 2,
            maximumTags: 5,
          }
        },
      ]}
    />
  )
}
