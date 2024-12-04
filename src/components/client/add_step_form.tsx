import Form from "c@/client/form"


export default function AddStepForm({ action }: { action: (data: FormData) => Promise<void>}) {
  return (
    <Form
      action={action}
      buttonText="Add"
      inputs={[
        {
          type: "text",
          name: "step",
          props: {
            label: "Step text:",
            placeholder: "Mix [dry] and [wet]...",
            validationSteps: ["not-empty"],
          }
        },
      ]}
    />
  )
}
