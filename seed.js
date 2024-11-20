import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


async function seed() {
  await prisma.function.deleteMany({})
  await prisma.node.deleteMany({})
  await prisma.recipe.deleteMany({})
  await prisma.recipeStep.deleteMany({})
  await prisma.step.deleteMany({})
  await prisma.tag.deleteMany({})

  await prisma.tag.createMany({
    data: [
      {name: "baking"},
      {name: "with pan"},
      {name: "vegetarian"},
      {name: "gluten-free"},
    ]
  })
  await prisma.function.createMany({
    data: [
      {name: "pan greese"},
      {name: "dry"},
      {name: "wet"},
      {name: "raw"},
      {name: "cooked"},
    ]
  })

  const tags = await prisma.tag.findMany({})
  const functions = await prisma.function.findMany({})

  const nodeCreationData = [
    {
      name: "butter",
      tags: {
        connect: [
          { id: tags[0].id },
          { id: tags[1].id },
          { id: tags[2].id },
          { id: tags[3].id },
        ]
      }
    },
    {
      name: "flour",
      tags: {
        connect: [
          { id: tags[0].id },
          { id: tags[2].id },
        ]
      }
    },
  ]

  await prisma.$transaction(
    nodeCreationData.map(
      (data) => (
        prisma.node.create({
          data: data
        })
      )
    )
  )
}

seed()
