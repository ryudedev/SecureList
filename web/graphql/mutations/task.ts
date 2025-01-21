import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation createTask($data: CreateTaskInput!) {
    createTask(data: $data) {
      id
      title
      description
      status
      label
      priority
      dueDate
      isPrivate
      groupId
    }
  }
`
