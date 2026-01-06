export const typeDefs = `#graphql
  """
  User type representing a user in the system
  """
  type User {
    """
    Unique identifier for the user (CUID format)
    """
    id: String!
    """
    The user's display name
    """
    name: String!
  }

  type Query {
    """
    Retrieve a single user by their ID
    """
    user(id: String!): User
  }
`;
