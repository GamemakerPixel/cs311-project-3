import AddIngredientForm from "c@/client/add_ingredient_form"
import AddStepForm from "c@/client/add_step_form"
import GenerateRecipeForm from "c@/client/generate_recipe_form"


export default function Page() {
  return (
    <div>
      <h1>Generate a recipe!</h1>
      <GenerateRecipeForm />
      <AddIngredientForm />
      <AddStepForm />

    </div>
  )
}

/*
*/
