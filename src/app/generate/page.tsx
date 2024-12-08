import { redirect } from "next/navigation"

import AddIngredientForm from "c@/client/add_ingredient_form"
import AddStepForm from "c@/client/add_step_form"
import GenerateRecipeForm from "c@/client/generate_recipe_form"
import PaginatedNameBrowser from "c@/client/paginated_name_browser"
import ShowHide from "c@/client/show_hide"
import {
  addIngredient,
  addStep,
  getPage,
  getStepCount,
  getNonexistantTags,
} from "@/src/util/server/database"
import {
  ErrorResponse,
  isBlank,
  parseTags,
  getFunctionsFromStep,
  tagCountOutsideInclusiveRange,
  stepHasUnclosedFunction,
  stepHasNestedFunction,
  isNotANumber,
  containsError,
} from "@/src/util/server/input_parsing"


export default function Page() {
  async function submitGenerationForm(current_state, data: FormData): { [inputName: string]: string } {
    "use server"

    async function validateGenerationForm(data: FormData): { [inputName: string]: string } {
      let response: ErrorResponse = {
        "steps": "",
        "tags": "",
      }

      if (isNotANumber(data.get("steps"))) {
        response["steps"] = "Step count must be a number."
      }
      else if (parseInt(data.get("steps") <= 0)) {
        response["steps"] = "Step count must be greater than 0."
      }

      if (tagCountOutsideInclusiveRange(data.get("tags"), 2, 5)) {
        response["tags"] = "You must add between 2 and 5 tags."
      }

      // Only run the database checks when the input has been validated.
      if (!containsError(response)) {
        const tags: string[] = parseTags(data.get("tags"))
        const stepCount: number = parseInt(data.get("steps"))

        const databaseStepCount: number = await getStepCount()
        if (databaseStepCount < stepCount) {
          response["steps"] = `Too many steps! Only ${databaseStepCount} are avaliable!`
        }

        const nonexistantTags: string[] = await getNonexistantTags(tags)
        if (nonexistantTags.length != 0) {
          response["tags"] = `The following tags do not exist: ${nonexistantTags.join(", ")}. Add them to an ingredient first to use them.`
        }

        // If this there is no error here, we want to go ahead and generate the recipe.
        if (!containsError(response)) {
          redirect(`/view/generated?count=${stepCount}&tags=${tags.join(",")}`)
        }
      }


      return response
    }

    return await validateGenerationForm(data)
  }


  async function submitIngredientForm(current_state, data: FormData): { [inputName: string]: string } {
    "use server"
    // Server side validation only.
    function validateIngredientForm(data: FormData): { [inputName: string]: string } {
      let response: ErrorResponse = {
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
      let response: ErrorResponse = {
        "step": "",
      }
      
      if (isBlank(data.get("step"))) {
        response["step"] = "Step cannot be blank."
      }

      if (stepHasUnclosedFunction(data.get("step"))) {
        response["step"] = "Function brackets must be in pairs."
      }
      else if (stepHasNestedFunction(data.get("step"))) {
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

  const pageItemCount = 3

  return (
    <div className="flex flex-col">
      <h1>Generate a recipe!</h1>
      <GenerateRecipeForm action={submitGenerationForm}/>
      <ShowHide
        showButtonText="Browse Existing Tags"
        hideButtonText="Close"
      >
        <PaginatedNameBrowser
          getNextPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, pageItemCount, "tag")
          }}
          getPreviousPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, -pageItemCount, "tag")
          }}
          title="Browse Tags:"
        />
      </ShowHide>
      <ShowHide
        showButtonText="Browse Existing Functions"
        hideButtonText="Close"
      >
        <PaginatedNameBrowser
          getNextPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, pageItemCount, "function")
          }}
          getPreviousPage={async (cursor: number) => {
            "use server"
            return await getPage(cursor, -pageItemCount, "function")
          }}
          title="Browse Functions:"
        />
      </ShowHide>
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
