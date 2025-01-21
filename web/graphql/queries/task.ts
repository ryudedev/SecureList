import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
      status
      label
      priority
      dueDate
      groupId
      isPrivate
      tags
    }
  }
`

export const GET_TASK_BY_ID = gql`
  query taskByID($id: Float!){
    taskByID(id: $id) {
      id
      title
      description
      status
      label
      priority
      dueDate
      groupId
      isPrivate
    }
  }
`
