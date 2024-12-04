import Form from "c@/client/form"


export default function AddIngredientForm({ action }: { action: (data: FormData) => Promise<void>}) {
  return (
    <Form
      action={action}
      buttonText="Add"
      inputs={[
        {
          type: "text",
          name: "name",
          props: {
            label: "Name: ",
            placeholder: "Name",
            validationSteps: ["not-empty"],
          }
        },
        {
          type: "tags",
          name: "tags",
          props: {
            minimumTags: 1,
          }
        },
        {
          type: "tags",
          name: "functions",
          props: {
            label: "Functions: ",
            placeholder: "func1,func2,func3",
            notEnoughTagsMessage: "You need at least one function.",
            minimumTags: 1,
          }
        },
      ]}
    />
  )
}
