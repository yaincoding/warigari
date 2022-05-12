1. 모듈 설치

- `npm i --save express-graphql graphql`

2. 예제

- 코드 작성

```jsx
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
```

- 쿼리 확인
  ![쿼리결과](./imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-12%20%EC%98%A4%ED%9B%84%207.31.11.png)

3. 스키마 만들기
   GraphQL의 스키마를 만드는 방법은

- buildSchema()를 사용하여 String 형태로 명시
- GraphQLSchema()를 사용하여 객체 형태로 명시

  두 가지 방법이 있다.
