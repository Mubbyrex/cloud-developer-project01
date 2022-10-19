import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils'
import { createToDo } from '../../businessLogic/todos'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item

    console.log('creating a new TODO item', event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const toDoItem = await createToDo(newTodo, jwtToken)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: toDoItem
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
