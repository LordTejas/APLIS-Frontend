import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { PrismaClient } from '@prisma/client' 
import { cache } from 'react'
import { redirect } from 'next/navigation'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.user) {
    redirect('/signin')
  }
 
  return { isAuth: true, user: session.user }
})

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null
 
  try {
    const prisma = new PrismaClient();

    const data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
 
    const user = data[0]
 
    return user
  } catch (error) {
    return null
  }
})