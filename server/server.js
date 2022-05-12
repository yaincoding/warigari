import express from "express";
import globalRouter from "./routes/global.routes.js";
import searchRouter from "./routes/search/search.js";

// 2022.05.12
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
    persons : [Person]
  }
  
  type Person {
    name: String,
    age: Int
  }
`);

const root = {
  hello: () => "Hello World!",
  persons: () => [
    { name: "kim", age: 29 },
    { name: "seo", age: 31 },
    { name: "park", age: 32 },
  ],
};

const app = express();

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.use("/", globalRouter);
app.use("/api/search", searchRouter);

export default app;
