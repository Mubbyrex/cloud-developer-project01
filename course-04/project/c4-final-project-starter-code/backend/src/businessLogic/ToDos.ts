import { TodoItem } from '../models/TodoItem'
import { parseUserId } from '../auth/utils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { ToDoAccess } from '../helpers/todosAcess'

const uuidv4 = require('uuid/v4')
const toDoAccessInstance = new ToDoAccess()

export function generateUploadUrl(todoId: string): Promise<string> {
  return toDoAccessInstance.generateSignedUploadUrl(todoId)
}

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return toDoAccessInstance.getTodos(userId)
}

export function createToDo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {
  const userId = parseUserId(jwtToken)
  const todoId = uuidv4()
  const s3BucketName = process.env.S3_BUCKET_NAME

  return toDoAccessInstance.newToDo({
    userId: userId,
    todoId: todoId,
    attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    createdAt: new Date().getTime().toString(),
    done: false,
    ...createTodoRequest
  })
}

export function updateToDo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  jwtToken: string
): Promise<TodoUpdate> {
  const userId = parseUserId(jwtToken)
  return toDoAccessInstance.updateToDo(updateTodoRequest, todoId, userId)
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
  const userId = parseUserId(jwtToken)
  return toDoAccessInstance.removeToDo(todoId, userId)
}
