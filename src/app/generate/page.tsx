import AddIngredientForm from "c@/client/add_ingredient_form"
import AddStepForm from "c@/client/add_step_form"
import GenerateRecipeForm from "c@/client/generate_recipe_form"
import ShowHide from "c@/client/show_hide"
import { addIngredient, addStep } from "@/src/util/server/database"
import {
  isBlank,
  parseTags,
  getFunctionsFromStep,
  tagCountLessThan,
  stepHasUnclosedFunction,
  stepHasNestedFunction
} from "@/src/util/server/input_parsing"


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


export default function Page() {
  async function submitIngredientForm(current_state, data: FormData): { [inputName: string]: string } {
    "use server"
    // Server side validation only.
    function validateIngredientForm(data: FormData): { [inputName: string]: string } {
      let response: {[inputName: string]: string} = {
        "name": "",
        "tags": "",
        "functions": "",
      }
      
      if (isBlank(data.get("name"))) {
        response["name"] = "Name cannot be blank."
      }

      if (tagCountLessThan(data.get("tags"), 1)) {
        response["tags"] = "You must add at least one tag."
      }

      if (tagCountLessThan(data.get("functions"), 1)) {
        response["functions"] = "You must add at least one function."
      }

      return response
    }

    const response = validateIngredientForm(data)

    if (!containsError(response)) {
      const tags = parseTags(data.get("tags"))
      const functions = parseTags(data.get("functions"))
      const name = data.get("name")

      await addIngredient(name, tags, functions)
    }

    return response
  }


  async function submitStepForm(current_state, data: FormData): { [inputName: string]: string } {
    "use server"
    function validateStepForm(data: FormData): { [inputName: string]: string } {
      let response: {[inputName: string]: string} = {
        "step": "",
      }
      
      if (isBlank(data.get("step"))) {
        response["step"] = "Step cannot be blank."
      }

      if (stepHasUnclosedFunction(data.get("step"))) {
        response["step"] = "Function brackets must be in pairs."
      }

      if (stepHasNestedFunction(data.get("step"))) {
        response["step"] = "Function brackets cannot be nested."
      }

      return response
    }

    const response = validateStepForm(data)

    if (!containsError(response)) {
      const step = data.get("step")
      const functions = getFunctionsFromStep(data.get("step"))
    
      await addStep(step, functions)
    }

    return response

  }


  return (
    <div>
      <h1>Generate a recipe!</h1>
      <GenerateRecipeForm />
      <ShowHide
        hintText="Not enough ingredients for you? Want to spice up your recipes?"
        showButtonText="Add an ingredient!"
        hideButtonText="Cancel"
      >
        <AddIngredientForm action={submitIngredientForm}/>
      </ShowHide>
      <ShowHide
        hintText="Hmm. Perhaps you're more interested in the delicate art of changing how those ingredients are prepared."
        showButtonText="Add a step!"
        hideButtonText="Cancel"
      >
        <AddStepForm action={submitStepForm}/>
      </ShowHide>

    </div>
  )
}
