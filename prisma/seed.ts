// eslint-disable-next-line 
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fetchData(url: string) {
  const response = await fetch(url)
  return response.json()
}

async function main() {
  try {
    const users = await fetchData('https://jsonplaceholder.typicode.com/users')
    const posts = await fetchData('https://jsonplaceholder.typicode.com/posts')

    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      })
    }

    for (const post of posts) {
      await prisma.post.create({
        data: {
          id: post.id,
          title: post.title,
          body: post.body,
          userId: post.userId,
        },
      })
    }

    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()