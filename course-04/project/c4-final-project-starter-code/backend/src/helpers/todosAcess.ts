import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class ToDoAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly s3: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async generateSignedUploadUrl(todoId: string): Promise<string> {
    console.log('Generating URL')

    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
    console.log(url)

    return url
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todo')

    const parameter = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(parameter).promise()
    console.log(result)
    const items = result.Items

    return items as TodoItem[]
  }

  async newToDo(todoItem: TodoItem): Promise<TodoItem> {
    console.log('Creating new todo')

    const parameter = {
      TableName: this.todoTable,
      Item: todoItem
    }

    await this.docClient.put(parameter).promise()

    return todoItem
  }

  async updateToDo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    console.log('Updating todo')

    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :date, done = :done',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':date': todoUpdate.dueDate,
          ':done': todoUpdate.done
        }
      })
      .promise()

    return todoUpdate
  }

  async removeToDo(todoId: string, userId: string): Promise<string> {
    console.log('Deleting todo')

    const parameter = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    const result = await this.docClient.delete(parameter).promise()
    console.log(result)

    return ''
  }
}
