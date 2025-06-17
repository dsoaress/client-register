import express from 'express'

const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.listen(3000, () => console.log('User Register Service is running on port 3000'))
