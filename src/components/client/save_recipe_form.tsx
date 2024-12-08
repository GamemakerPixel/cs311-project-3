import Form from "c@/client/form"

import { ErrorResponse } from "c@/server/input_parsing"


export default function SaveRecipeForm(
  {
    action,
    steps,
    tags,
  }: {
    action: (data: FormData) => Promise<ErrorResponse>
    steps: string[]
    tags: string
  }) {

  return (
    <Form
      action={action}
      buttonText="Save Recipe"
      inputs={[
        {
          type: "text",
          name: "title",
          props: {
            label: "Title: ",
            placeholder: "Recipe Title",
            validationSteps: ["not-empty"],
          }
        },
        {
          type: "tags",
          name: "tags",
          props: {
            minimumTags: 1,
            initialValue: tags,
          }
        },
        {
          type: "image",
          name: "image",
        },
      ]}
      hiddenData={{
        steps: steps.join("\n")
      }}
    />
  )
}

/*
      hiddenData = {
        steps: steps.join("\n")
      }
*/
