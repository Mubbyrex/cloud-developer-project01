import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteToDo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    console.log('Remove a TODO item ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const todoId = event.pathParameters.todoId

    const deletedItem = await deleteToDo(todoId, jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({ deletedItem })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
