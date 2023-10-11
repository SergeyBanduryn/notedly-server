import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar DateTime

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notes(offset: Int!, limit: Int!): [Note!]!
    favorites(offset: Int!, limit: Int!): [Note!]!
    totalNotes: Int!
    totalFavorites: Int!
  }

  type Note {
    id: ID!
    content: String!
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
  }

  type Query {
    notes(offset: Int!, limit: Int!): [Note!]!
    note(id: ID!): Note!
    user(username: String!): User!
    users: [User!]!
    me: User
    totalNotes: Int!
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
    addFakeNotes: Boolean!
    deleteAllNotes: Boolean!
  }
`;

export default typeDefs;
