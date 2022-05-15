import Graphql from "graphql";
import { readOneUser } from "../services/user.js";

const { buildSchema } = Graphql;

/**
 * exclamation mark : non null
 */
const schema = buildSchema(`
  type Query {
    user(account: String!): User
  }

  type User {
    account: String
    name: String
  }
`);

const resolver = {
  user: async (args, context, info) => {
    const { account } = args;
    const user = await readOneUser(account);
    return user;
  },
};

export { schema, resolver };
