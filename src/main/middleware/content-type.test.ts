import request from 'supertest'
import app from '../config/app'

describe('Content-type Middleware', () => {
  test('devera retornar um content-type como json', async () => {
    app.get('/test_content-type', (req, res) => {
      res.json('')
    })
    await request(app)
      .get('/test_content-type')
      .expect('content-type', /json/)
  })

  test('devera retornar um content-type como xml', async () => {
    app.get('/test_content-type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content-type_xml')
      .expect('content-type', /xml/)
  })
})
