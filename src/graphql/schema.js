module.exports.typeDefs = `#graphql
  type User {
    _id: ID
    userName: String!
    email: String!
    password: String
  }

  type AuthData {
    accessToken: String!
    refreshToken: String!
    loginCount: Int!
  }

  type Query {
    usersCount: Int!
  }

  type Mutation {
    registerUser(userName: String! email: String! password: String!): User
    login(email: String! password: String!): AuthData
  }

  type Subscription {
    usersCount: Int
  }
`;
