import { PrismaClient } from "@prisma/client"

// It is generally not recommended to create multiple PrismaClient(s), which is why
// I'm putting all database-accessing methods in here.
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


export async function getPage(
  cursor: {
    next: number
    previous: number
  } | undefined,
  count: number,
  table: string
) {
  "use server"
  const request = {
    take: count,
    orderBy: {
      id: "asc",
    },
  }

  const borderRequest = {
    take: Math.sign(count),
    skip: Math.abs(count),
  }

  if (cursor) {
    const cursorParam = {id: (count < 0) ? cursor.previous : cursor.next}
    request.cursor = cursorParam
    request.skip = 1
    borderRequest.cursor = cursorParam
    borderRequest.skip += 1
  }

  const [
    response,
    borderResponse,
  ] = await prisma.$transaction([
    prisma[table].findMany(request),
    prisma[table].findMany(borderRequest),
  ])

  console.log(cursor)
  console.log(response)
  console.log(borderResponse)

  const names = response.map((tag) => tag.name)
  const newCursor = {
    next: response.at(-1).id,
    previous: response.at(0).id,
  }
  const last = borderResponse.length == 0


  return {
    names: names,
    cursor: newCursor,
    last: last,
  }
}


export async function getStepCount(): number {
  return await prisma.step.count()
}


export async function getNonexistantTags(tags: string[]): string[] {
  let nonexistantTags = []

  const responses = await prisma.$transaction(
    tags.map((tag: string) => (
      prisma.tag.findUnique({
        where: {
          name: tag
        }
      })
    ))
  )

  return tags.filter((tag: string, index: number) => (
    responses[index] == null
  ))
}


export async function getAllSteps(): string[] {
  const response = await prisma.step.findMany()

  return response.map((step: {text: string}) => step.text)
}


export async function getIngredientsWithTagsAndFunction(tags: string[], func: string): string[] {
  const response = await prisma.ingredient.findMany({
    where: {
      function: {
        some: {
          name: func
        }
      },
      tags: {
        some: {
          OR: tags.map((tag: string) => ({
            name: tag
          }))
        }
      }
    },
    include: {
      function: true,
      tags: true,
    }
  })

  return response.map((ingredient: {name: string}) => ingredient.name)
}


export async function getIngredientsWithFunction(func: string): string[] {
  const response = await prisma.function.findUnique({
    where: {
      name: func
    },
    include: {
      ingredients: true
    }
  })

  return response.ingredients.map((ingredient: { name: string }) => ingredient.name)
}


export async function getIngredientsForFunctionsWithTags(functions: string[], tags: string[]) {
  const responses = await prisma.$transaction(
    functions.map((func: string) => {
      return prisma.ingredient.findMany({
        where: {
          function: {
            some: {
              name: func
            }
          },
          tags: {
            some: {
              OR: tags.map((tag: string) => ({
                name: tag
              }))
            }
          }
        },
        include: {
          function: true,
          tags: true,
        }
      })
    })
  )

  return responses.map((list) => list.map((ingredient: {name: string}) => ingredient.name))
}

// Essentially the same as getIngredientsForFunctionsWithTags but no tag requirement.
export async function getIngredientsForFunctions(functions: string[]) {
  const responses = await prisma.$transaction(
    functions.map((func: string) => {
      return prisma.ingredient.findMany({
        where: {
          function: {
            some: {
              name: func
            }
          },
        },
        include: {
          function: true,
          tags: true,
        }
      })
    })
  )

  return responses.map((list) => list.map((ingredient: {name: string}) => ingredient.name))
}


export async function getAllIngredients(functions: string[]) {
  return await prisma.ingredient.findMany()
}

