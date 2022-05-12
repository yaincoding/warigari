import express from "express";
import globalRouter from "./routes/global.routes.js";
import searchRouter from "./routes/search/search.js";
import Graphql from "graphql";

// 2022.05.12
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

// const schema = buildSchema(`
//   type Query {
//     hello: String
//     persons : [Person]
//   }

//   type Person {
//     name: String,
//     age: Int
//   }
// `);

const session = {
  userId: 100,
  expiresIn: 30000,
};

const TypePerson = new Graphql.GraphQLObjectType({
  name: "Person",
  fields: {
    name: { type: Graphql.GraphQLString },
    age: { type: Graphql.GraphQLInt },
  },
});

const TypeQuery = new Graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: Graphql.GraphQLString,
      resolve: () => "Hello world!",
    },
    persons: {
      type: Graphql.GraphQLList(TypePerson),
      resolve: (obj, args, context, info) => {
        console.log(args);
        console.log("*****");
        console.log(context);
        console.log("-----");
        console.log(info);
        // console.log("hahah");
        return [
          { name: "kim", age: 29 },
          { name: "seo", age: 31 },
          { name: "park", age: 32 },
        ];
      },
    },
  },
});

const schema = new Graphql.GraphQLSchema({ query: TypeQuery });

// const root = {
//   hello: () => "Hello World!",
//   persons: () => [
//     { name: "kim", age: 29 },
//     { name: "seo", age: 31 },
//     { name: "park", age: 32 },
//   ],
// };

const app = express();

app.set(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/graphql", graphqlHTTP({ schema, context: session, graphiql: true }));
app.use("/", globalRouter);
app.use("/api/search", searchRouter);

export default app;
