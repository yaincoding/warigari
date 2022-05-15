## 1. 쿼리 추가

지난번 특정 유저를 검색하는 API는 완성이 되었으므로, 모든 유저를 검색하는 API를 만들어보았다.

```jsx
const schema = buildSchema(`
  type Query {
    user(account: String!): User
    users: [User]
  }

  type User {
    id: ID
    account: String
    name: String
  }
`);

const resolver = {
  // 상단에서 non-scalar 추가
  user: async (args, context, info) => {
    const { account } = args;
    return await readOneUser(account);
  },
  users: async () => await readAllusers(),
};
```

users라는 쿼리를 추가하고, 응답으로 받는 타입은 User타입의 List이다. `[User]`

여기에 대응하는 resolver도 추가해줬다.

![쿼리 결과](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-16%20%EC%98%A4%EC%A0%84%201.15.51.png)

## 2. GraphQL 데이터 타입

데이터베이스에 타임스탬프를 찍어놓고 있었으므로, createdAt 데이터를 뽑아보고 싶었다. 그래서 type User 필드에 `createdAt: String` 을 추가 해줬더니.......

![날짜](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-16%20%EC%98%A4%EC%A0%84%201.19.02.png)

...;;; 자료형을 검색해보니, Date와 같은 타입은 기본으로 지원하지 않는다. GraphQL 데이터 타입을 좀 공부할 필요가 있었다.

### (1) 스칼라(Scalar Type)

GraphQL 에서 제공하는 기본 자료형

- Int : 32비트 정수
- Float : 실수
- String : UTF-8 문자열
- Boolean : true / false
- ID : 내부적으로 String 타입이지만, identifier라는 것을 명시적으로 나타내기 위해 사용

### (2) 사용자 지정 스칼라 (Non-Scalar Type or Custom Scalar Type)

날짜를 표현하기 위해서는 별도로 사용자 지정 스칼라를 정의할 필요가 있었다.

구글링 결과 ...

```jsx
import Graphql, { GraphQLScalarType } from "graphql";

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
    createdAt: Date
  }
`);
```

`GraphQLScalarType` 라는 클래스 인스턴스 생성자를 이용해서 새로운 scalar를 만든다. 각 필드에 대해서는 따로 더 공부해야겠다.
스키마 작성 방법에 따라 사용자 지정 스칼라를 쓰는 방법이 다르다. buildSchema의 경우, 스키마 내부에 `scalar Date` 한 줄을 적어주면 된다.

![쿼리 결과](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-16%20%EC%98%A4%EC%A0%84%201.32.13.png)

## 3. Mutation

이제 서버 측 Side-Effect가 일어나는 Mutation을 만들 차례. 유저 1명을 생성하는 createUser를 만들어줬다.

```jsx
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
    createdAt: Date
  }

  type Mutation {
    createUser(account: String!, name: String!): User
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
  createUser: async (args) => await createUser(args),
};
```

유저 생성시 account, name 필드를 필수로 입력받도록 non-nullable 옵션을 주었다. 응답으로는 새로 생성된 유저 정보를 받도록 지정했다.

![쿼리결과](../imgs/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202022-05-16%20%EC%98%A4%EC%A0%84%201.40.31.png)

응답으로 객체 타입을 지정할 경우, mutation 또한 마찬가지로, 질의에 객체의 필드를 최소한 1개는 지정해야 하는 듯 하다.

## 참고자료

[GraphQL 기본 자료형](https://yuddomack.tistory.com/entry/GraphQL-Schema%EC%9D%98-%EA%B8%B0%EB%B3%B8-%EB%AC%B8%EB%B2%95)  
[공식 문서](https://graphql.org/learn/schema/)
