import { gql } from "@apollo/client";

export const GET_ME = gql`
  query {
    me {
      id
      email
      name
    }
  }
`
