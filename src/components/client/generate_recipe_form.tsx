"use client"
import Input from "c@/client/input"
import TagInput from "c@/client/tag_input"


export default function GenerateRecipeForm({ action }: { action: (data: FormData) => Promise<void> }) {
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

  // Replace Tags input with a custom one later.
  return (
    <form className="flex flex-col" action={action}>
      <p className="text-center">Add a step:</p>
      <Input label="Number of steps:" name="steps" placeholder="3, 5, 7" validateInput={validateStepCount} />
      <TagInput name="tags" minimumTags={2}/>
      <button type="submit" className="mx-auto default-button">
        Generate!
      </button>
    </form>
  )
}
