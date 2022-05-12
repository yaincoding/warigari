import express from "express";
import globalRouter from "./routes/global.routes.js";
<<<<<<< HEAD

// 2022.05.12
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => "Hello World!" };
=======
import searchRouter from "./routes/search/search.js";
>>>>>>> master

const app = express();
const PORT = process.env.PORT || 5000;

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));
app.use("/", globalRouter);
app.use("/api/search", searchRouter);

app.listen(PORT, () => {
  console.log(`express server is listening on ${PORT}`);
});

export default app;
