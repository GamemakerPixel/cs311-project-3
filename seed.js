const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()


async function seed_ingredients(ingredients) {
  await prisma.$transaction(
    ingredients.map((ingredient) => (
      prisma.ingredient.create({
        data: {
          name: ingredient.name,
          tags: {
            connectOrCreate:
              ingredient.tags.map((tag) => ({
                where: {
                  name: tag
                },
                create: {
                  name: tag
                }
              }))
          },
          function: {
            connectOrCreate:
              ingredient.functions.map((func) => ({
                where: {
                  name: func
                },
                create: {
                  name: func
                }
              }))
          }
        }
      })
    ))
  )
}


async function seed_steps(steps) {
  await prisma.step.createMany({
    data: steps.map((step) => ({
      text: step
    }))
  })
}

async function seed_recipes(recipes) {
  await prisma.$transaction(
    recipes.map((recipe) => (
      prisma.recipe.create({
        data: {
          name: recipe.name,
          likes: recipe.likes,
          tags: {
            connectOrCreate: recipe.tags.map((tag) => ({
              where: {
                name: tag
              },
              create: {
                name: tag
              }
            }))
          },
          steps: {
            create: recipe.steps.map((step) => ({
              text: step
            }))
          }
        }
      })
    ))
  )
}


async function seed() {
  await prisma.ingredient.deleteMany({})
  await prisma.step.deleteMany({})
  await prisma.recipeStep.deleteMany({})
  await prisma.recipe.deleteMany({})
  await prisma.function.deleteMany({})
  await prisma.tag.deleteMany({})

  const data = await require("./seed_data.json")

  console.log("Seeding ingredients...")
  await seed_ingredients(data.ingredients)
  console.log("Seeding steps...")
  await seed_steps(data.steps)
  console.log("Seeding recipes...")
  await seed_recipes(data.recipes)
}

seed()
