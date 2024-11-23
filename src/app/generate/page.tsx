import AddIngredientForm from "c@/client/add_ingredient_form"
import AddStepForm from "c@/client/add_step_form"
import GenerateRecipeForm from "c@/client/generate_recipe_form"
import { addIngredient } from "c@/server/database"


export default function Page() {


  async function submitIngredientForm(current_state, data: FormData): { [inputName: string]: string } {
    "use server"
    function validateIngredientForm(data: FormData): { [inputName: string]: string } {
      console.log(data)
      const minimumTags = 1
      let response: {[inputName: string]: string} = {
        "name": "",
        "tags": ""
      }
      
      if (!data.get("name")) {
        response["name"] = "Name cannot be empty."
      }

      if (!data.get("tags")) {
        response["tags"] = `You must add at least ${minimumTags} tags.`
      }

      return response
    }

    function containsError(validationResponse: {[inputName: string]: string}): boolean {
      let errorFlag = false

      Object.keys(validationResponse).forEach((key: string) => {
        if (validationResponse[key]) {
          errorFlag = true
          return
        }
      })

      return errorFlag
    }

    const response = validateIngredientForm(data)

    if (containsError(response)) {
      return response
    }

    const tagDelimiter = ","
    function parseTags(tagInput: string): string[] {
      const splitTags = tagInput.split(tagDelimiter)

      return splitTags.filter((tag) => tag != "")
    }

    const tags = parseTags(data.get("tags"))
    const name = data.get("name")

    await addIngredient(name, tags)

    return response
  }


  return (
    <div>
      <h1>Generate a recipe!</h1>
      <GenerateRecipeForm />
      <AddIngredientForm action={submitIngredientForm}/>
      <AddStepForm />

    </div>
  )
}
