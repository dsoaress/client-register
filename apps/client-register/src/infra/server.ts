import { serverModule } from './server.module'

export async function server(): Promise<void> {
  const PORT = 3000
  const server = await serverModule()
  await server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}
