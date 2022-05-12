### 1. 모듈 설치

- `npm i --save express-graphql graphql`

### 2. 예제

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

### 3. 스키마 만들기

GraphQL의 스키마를 만드는 방법은

- buildSchema()를 사용하여 String 형태로 명시
- GraphQLSchema()를 사용하여 객체 형태로 명시

  두 가지 방법이 있다.

#### 3-1 buildSchema 활용: 코드를 아래와 같이 수정

```jsx
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
```

아래와 같이 graphql 질의를 해보면 데이터가 persons 배열이 응답으로 오는 것을 확인할 수 있다.

```
query {
  persons {
    name
    age
  }
}
```

여기서 root를 resolver라 부르며, graphql은 schema와 resolver로 동작한다는 것을 알 수 있다. buildSchema로 정의한 패턴에서는, graphqlHTTP의 rootValue가 resolver 객체를 가지고, 객체 내부에서 query와 매칭되는 메서드를 실행한다. 실제 CRUD도 이 곳에서 이뤄진다.

#### 3-2 GraphQLSchema 활용

```jsx
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
      resolve: () => {
        console.log("hahah");
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
```

### 4. Context?

GraphQL의 resolver는 Context를 사용할 수 있다. Context로 사용할 수 있는 주요 객체는 session이 있다.

```jsx
// Fake data
const session = {
  userId: 100,
  expiresIn: 30000,
};

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

app.use("/graphql", graphqlHTTP({ schema, context: session, graphiql: true }));
```

session이라는 fake data를 만들고, graphql 서버 옵션에서 context: session을 주었다. 그 뒤 resolver 메서드 내에서 context를 확인했다.

resolver의 매개변수는 GraphQL 공식 문서를 참고했다. 참고로 buildSchema와 GraphQLSchema의 resolver 매개변수 순서가 다르다.
![쿼리 결과](./imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-13%20%EC%98%A4%EC%A0%84%2012.49.37.png)

아직 정확한 용도는 파악이 안되지만, express 미들웨어처럼 활용이 가능할 것으로 보인다.

### 참고자료

[GraphQL 공식 문서](https://graphql.org/learn/execution/#root-fields-resolvers)
[express-graphql 시작하기(Hello World Guide)](https://yuddomack.tistory.com/entry/expressgraphql-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0Hello-World-Guide)
