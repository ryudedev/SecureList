import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
 query {
  groups {
    id
    name
    description
    createdAt
  }
 }
`
