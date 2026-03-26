import { prisma } from "./prisma"

// Temporary: Get or create a default user for development
// Replace this with proper NextAuth.js authentication later
export async function getCurrentUser() {
  const email = "user@finplanner.app"

  let user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "FinPlanner User",
      },
    })
  }

  return user
}

export async function getUserId(): Promise<string> {
  const user = await getCurrentUser()
  return user.id
}
