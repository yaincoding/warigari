import express from "express";
import globalRouter from "./routes/global.routes.js";

// 2022.05.12
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => "Hello World!" };

const app = express();

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.use("/", globalRouter);

export default app;
