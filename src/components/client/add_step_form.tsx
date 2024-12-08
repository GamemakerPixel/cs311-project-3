import Form from "c@/client/form"
import { ErrorResponse } from "c@/server/input_parsing"


export default function AddStepForm({ action }: { action: (data: FormData) => Promise<void>}) {
  return (
    <Form
      action={action}
      buttonText="Add"
      header="Add a step (use functions inside brackets to indicate placeholders): "
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
