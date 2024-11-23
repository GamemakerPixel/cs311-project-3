import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function addIngredient(name: string, tags: string[]) {
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
      }
    }
  })
}
