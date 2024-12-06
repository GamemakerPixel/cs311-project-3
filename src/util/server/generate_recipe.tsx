import { getAllSteps, getIngredientsForFunctionsWithTags, getIngredientsForFunctions, getAllIngredients } from "@/src/util/server/database"
import { getFunctionsFromStep } from "@/src/util/server/input_parsing"


async function pickSteps(count: number): string[] {
  // This method is not very efficient because it need to pull
  // the entire table - ideally prisma would support random
  // selection of elements, but since it doesn't my options
  // are using a raw SQL query (when I don't plan to validate
  // the URL variables) or just pull the whole table and pick
  // randomly.
  let steps: string[] = await getAllSteps()
  let selectedSteps: string[] = []

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * steps.length)
    const randomStep = steps.splice(randomIndex, 1)[0]
    selectedSteps.push(randomStep)
  }

  return selectedSteps
}


function extractFunctionsFromSteps(steps: string[]): string[] {
  let functions: string[] = []

  steps.forEach((step: string) => {
    functions.push(...getFunctionsFromStep(step))
  })

  return functions
}


async function getIngredientOptions(
  uniqueFunctions: string[],
  tags: string[]
): {
  ingredientMap: {[func: string]: string[]}
  warning: string
} {
  let warning: string = ""
  let ingredientMap: {[func: string]: string[]} = {}

  const ingredients: string[][] = await getIngredientsForFunctionsWithTags(uniqueFunctions, tags)
  ingredients.forEach((ingredientList: string[], index: number) => {
    if (ingredientList.length > 0){
      ingredientMap[uniqueFunctions[index]] = ingredientList
    }
  })

  // If querying by both function and tags fails to find at least one ingredient, query only by 
  // function.
  const functionsMissingTaggedIngredients: string[] = uniqueFunctions.filter((func: string, index: number) => ingredients[index].length == 0)
  if (functionsMissingTaggedIngredients.length > 0){
    warning = `Could not find an ingredient for these functions: ${functionsMissingTaggedIngredients.join(", ")} with these tags ${tags.join(", ")} - disregarding tags.`
    const untaggedIngredients: string[][] = await getIngredientsForFunctions(functionsMissingTaggedIngredients)

    untaggedIngredients.forEach((ingredientList: string[], index: number) => {
      if (ingredientList.length > 0) {
        ingredientMap[functionsMissingTaggedIngredients[index]] = ingredientList
      }
    })

    // If there are still functions that don't have ingredients, then we just pick a random ingredient.
    // As long as the database has at least one ingredient, the recipe should never fail to generate due to lack of ingredients.
    const functionsMissingIngredients: string[] = functionsMissingTaggedIngredients.filter((func: string, index: number) => untaggedIngredients[index].length == 0)
    if (functionsMissingIngredients.length > 0) {
      warning = `Could not find ingredients for these functions: ${functionsMissingIngredients.join(", ")} - picking random ingredients.`
      const allIngredients = getAllIngredients()
      functionsMissingIngredients.forEach((func: string) => {
        ingredientMap[func] = allIngredients
      })
    }
  }

  return {
    ingredientMap: ingredientMap,
    warning: warning
  }
}


function fillStep(
  step: string,
  ingredientsByFunction: {[func: string]: string}
): string {
  const functions = getFunctionsFromStep(step)

  let result = step
  functions.forEach((func: string) => {
    const possibleIngredients = ingredientsByFunction[func]
    const ingredient = possibleIngredients[
      Math.floor(Math.random() * possibleIngredients.length)
    ]
    result = result.replace(`[${func}]`, ingredient)
  })

  return result
}


function fillSteps(
  steps: string[],
  ingredientsByFunction: {[func: string]: string}
): string[] {
  return steps.map((step: string) => (
    fillStep(step, ingredientsByFunction)
  ))
}


export default async function generateRecipe(
  stepCount: number,
  tags: string[]
): {warning: string, steps: string[]} {
  const unformattedSteps: string[] = await pickSteps(stepCount)
  const functions: string[] = extractFunctionsFromSteps(unformattedSteps)
  const uniqueFunctions: string[] = [...(new Set(functions))]

  const options = await getIngredientOptions(uniqueFunctions, tags)
  const ingredientsByFunction: {[func: string]: string} = options.ingredientMap
  const warning: string = options.warning

  const formattedSteps = fillSteps(unformattedSteps, ingredientsByFunction)

  return {
    warning: warning, 
    steps: formattedSteps,
  }
}
