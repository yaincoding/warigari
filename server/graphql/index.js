import Graphql, { GraphQLScalarType } from "graphql";
import { readOneUser, readAllusers, createUser } from "../services/user.js";

const { buildSchema } = Graphql;

// 도대체 어떻게 작동하는거지?
new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

/**
 * exclamation mark : non null
 * scalar type : built-in graphql type (String, Int, Boolean, ID ....)
 * query랑 mutation이 동시에 작동 안 하네
 */
const schema = buildSchema(`
  scalar Date

  type Query {
    user(account: String!): User
    users: [User]
  }

  type User {
    id: ID
    account: String
    name: String
    createdAt: Date!
  }

  type Mutation {
    createUser(account: String!, name: String!) : ID
  }
`);

const resolver = {
  // 상단에서 non-scalar 추가
  user: async (args, context, info) => {
    const { account } = args;
    const user = await readOneUser(account);
    return user;
  },
  users: async () => await readAllusers(),
  createUser: async (args) => (await createUser(args)).id,
};

export { schema, resolver };
