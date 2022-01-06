export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/mydb',
  PORT: process.env.PORT ?? 3000,
  JWT: process.env.JWT ?? 'secret'
}
