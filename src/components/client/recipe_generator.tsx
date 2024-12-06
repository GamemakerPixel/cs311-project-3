"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import SaveRecipeForm from "c@/client/save_recipe_form"
import { ErrorResponse } from "@/src/util/server/input_parsing"

// Form for
// Title
// Tags
// Steps
// Image
//
// Also show error if generation fails.


function WarningMessage({ warning }: { warning: string }) {
  if (warning) {
    return (
      <p className="font-semibold text-warning mt-4">
        {warning}
      </p>
    )
  }
}


function StepList(
  {
    steps,
    warning
  }): {
    steps: string[]
    warning: string
  } {
  if (steps.length == 0) {
    return (
      <p>Generating your recipe...</p>
    )
  }

  return (
    <div className="flex flex-col items-center bg-darker_primary p-4 rounded-xl">
      <p className="mb-2">Steps:</p>
      <div>
        {steps.map((step: string, index: number) => (
          <p key={index}>{step}</p>
        ))}
      </div>
      <WarningMessage warning={warning} />
    </div>
  )
}


export default function RecipeGenerator(
  {
    generateAction,
    saveAction,
  }:
  {
    generateAction: (tags: string, stepCount: number) => Promise<{error: string, steps: string[]}>
    saveAction: (data: FormData) => Promise<ErrorResponse>
  }) {
  const [warning, setWarning] = useState<string>("")
  const [steps, setSteps] = useState<string[]>([])


  const params = useSearchParams()
  useEffect(() => {
    async function generateSteps() {
      const count: number = parseInt(params.get("count"))
      const tags: string[] = params.get("tags").split(",")

      const response: {warning: string, steps: string[]} = await generateAction(tags, count)
      setSteps(response.steps)
      setWarning(response.warning)
    }
    generateSteps()
  }, [])

  return (
    <div>
      <h1>Here's your recipe!</h1>
      <StepList steps={steps} warning={warning}/>
      <SaveRecipeForm action={saveAction} steps={steps} tags={params.get("tags")}/>
    </div>
  )
}
