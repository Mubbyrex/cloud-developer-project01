import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { generateUploadUrl } from '../../businessLogic/todos'
// import { getUserId } from '../utils'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// TODO: Return a presigned URL to upload a file for a TODO item with the provided id
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing presigned URL ', event)
    const todoId = event.pathParameters.todoId

    const URL = await generateUploadUrl(todoId)

    return {
      statusCode: 202,
      body: JSON.stringify({
        uploadUrl: URL
      })
    }
  }
)
handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
