// const swaggerAutogen = require('swagger-autogen')()

// const outputFile = './swagger_output.json'
// const endpointsFiles = ['./api/v1/routes/*.js','./api/v1/routes/bookings/*.js','./api/v1/routes/chats/*.js','./api/v1/routes/reports/*.js','./api/v1/routes/reviews/*.js','./api/v1/routes/supportTickets/*.js','./api/v1/routes/villas*.js']

// swaggerAutogen(outputFile, endpointsFiles)


// const postmanToOpenApi = require('postman-to-openapi')

// const postmanCollection = './Reviews and Ratings.postman_collection.json'
// const outputFile = './reviewsandratings.json'

// // Async/await
// try {
//     const result =  postmanToOpenApi(postmanCollection, outputFile, { defaultTag: 'General' })
//     // Without save the result in a file
//     const result2 = postmanToOpenApi(postmanCollection, null, { defaultTag: 'General' })
//     console.log(`OpenAPI specs: ${result}`)
// } catch (err) {
//     console.log(err)
// }

// // Promise callback style
// postmanToOpenApi(postmanCollection, outputFile, { defaultTag: 'General' })
//     .then(result => {
//         console.log(`OpenAPI specs: ${result}`)
//     })
//     .catch(err => {
//         console.log(err)
//     })