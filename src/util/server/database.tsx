import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function addIngredient(name: string, tags: string[], functions: string[]) {
  await prisma.ingredient.create({
    data: {
      name: name,
      tags: {
        connectOrCreate: tags.map((tag: string) => (
          {
            where: {
              name: tag
            },
            create: {
              name: tag
            }
          }
        ))
      },
      function: {
        connectOrCreate: functions.map((func: string) => (
          {
            where: {
              name: func
            },
            create: {
              name: func
            }
          }
        ))
      }
    }
  })
}

// Functions can be parsed by methods in utils/server/input_parsing.
export async function addStep(step: string, functions: string[]) {
  await prisma.$transaction(
    [
      prisma.step.create({
        data: {
          text: step
        }
      })
    ].concat(
      functions.map((func: string) => (
        prisma.function.upsert({
          where: {
            name: func
          },
          update: {},
          create: {
            name: func
          }
        })
      ))
    )
  )
}


