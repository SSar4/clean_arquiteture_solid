export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/mydb',
  PORT: process.env.PORT ?? 3000,
  JWT: process.env.JWT ?? 'secret'
}
