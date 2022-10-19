import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateToDo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing updatedTodo item ', event)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken)

    return {
      statusCode: 200,
      body: JSON.stringify({
        toDoItem
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
