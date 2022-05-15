import express from "express";
import globalRouter from "./routes/global.routes.js";
import searchRouter from "./routes/search/search.js";
import { graphqlHTTP } from "express-graphql";
import { schema, resolver } from "./graphql/index.js";
const app = express();

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

// graphiql: true -> playground 페이지
app.use(
  "/graphql",
  graphqlHTTP({ schema: schema, rootValue: resolver, graphiql: true })
);
app.use("/", globalRouter);
app.use("/api/search", searchRouter);

export default app;
