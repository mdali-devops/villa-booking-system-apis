const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./api/v1/routes/*.js','./api/v1/routes/bookings/*.js','./api/v1/routes/chats/*.js','./api/v1/routes/reports/*.js','./api/v1/routes/reviews/*.js','./api/v1/routes/supportTickets/*.js','./api/v1/routes/villas*.js']

swaggerAutogen(outputFile, endpointsFiles)
