## 1. 폴더 구조

```
+-- src
  +-- graphql
    +-- index.js
  +--- models
    +-- index.js
    +-- Users.js
  +-- services
    +-- users.js
  +-- app.js
```

## 2. Query API 구현

GraphQL 질의는 크게 두가지로 분류한다.

- Query : 질의 내용이 DB를 수정하는 등의 Side Effect를 발생시키지 않음 (READ)

- Mutation: 질의 내용이 DB를 수정하는 등의 Seide Effect를 발생시킴 (CREATE, UPDATE, DELETE)

우선 CRUD 중에서 가장 만만한 READ를 구현했다.

GraphQL entry-point는 당연 app.js에서 해주었다.
graphqlHTTP 옵션 중 graphiql은 playground를 사용할 것인지에 대한 옵션이다. GraphQL이 제공하는 web UI

`app.js`

```jsx
app.use(
  "/graphql",
  graphqlHTTP({ schema: schema, rootValue: resolver, graphiql: true })
);
```

이번에는 schema와 resolver 코드를 분리해서 사용했다. `graphql/index.js` 에서 schema와 resolver를 모두 만들었다.
사실 GraphQLSchema를 써보고 싶었지만.... 참고자료가 너무 부족했다. 어쩔 수 없이 buildSchema를 사용했다.

`type Query` 에서 `user(account: String!)` 은 user라는 쿼리는 account라는 문자열을 쿼리 인자로 받고, 이 인자는 반드시 포함되어야 한다(Non-nullable)라는 뜻이다. !(exclamation mark)는 공식문서를 찾아보면 그 의미를 알 수 있다.
마찬가지로 리턴 타입에 !붙이면 null이 리턴되는 상황에서는 에러를 발생시킬 것이다. 또한 예를 들어 리턴 타입이 `[User!]!`로 명시가 되어 있다면, 해당 쿼리는 반드시 리스트를 반환 `[]!` 하고, 그 리스트의 요소는 무조건 `User!` 타입을 갖는다는 뜻이다.
이 user 쿼리의 결과는 User라는 타입을 반환한다. User 타입은 그 아래에 다시 정의되어 있다.

resolver에는 실제 서비스 로직이 들어가면 될 듯 하다. query에 넣는 인자는 resolver의 첫번째 인자르 받을 수 있다.
위에서 정의한 쿼리 타입에서 `user(account: String!): User` 로 작성했으므로, resolver에서 그 값을 받아 SQL 혹은 ORM 사용에 쓸 수 있다.

`graphql/index.js`

```jsx
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
```

## 3. DB 구성

DB는 MySQL, ORM으로 sequelize를 사용했다.
`models/index.js`

```jsx
import { Sequelize, QueryTypes } from "sequelize";
import config from "../config/config.js";
const { NODE_ENV, dbConfig } = config;
import Users from "./Users.js";

const db = {};
const sequelize = new Sequelize(dbConfig[NODE_ENV]);

db.Op = Sequelize.Op;
db.QueryTypes = QueryTypes;
db.sequelize = sequelize;
db.Users = Users(sequelize, Sequelize);

export default db;
```

`models/Users.js`

```jsx
export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      account: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Users",
      timestamps: true,
      charset: "utf8",
      collation: "utf8_general_ci",
    }
  );
};
```

## 4. 쿼리 결과

우선 GraphQL playground에서 호출
![쿼리 결과](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-15%20%EC%98%A4%ED%9B%84%204.03.39.png)

Postman에서 호출
![포스트맨 호출 결과](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-15%20%EC%98%A4%ED%9B%84%204.21.31.png)
