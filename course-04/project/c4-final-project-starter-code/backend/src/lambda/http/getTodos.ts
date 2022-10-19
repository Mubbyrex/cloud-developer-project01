import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllToDo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    console.log(' Fetching all todos ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const toDos = await getAllToDo(jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: toDos
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
