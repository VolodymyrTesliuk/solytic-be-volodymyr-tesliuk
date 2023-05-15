"use strict";
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
console.log(SECRET_JWT_KEY);
const initialData = {
    'voltes@gmail.com': {
        id: 123,
        email: 'voltes@gmail.com',
        password: 'MayThe4thBeWithU'
    }
};
const fakeDb = new Map(Object.entries(initialData));
const schema = buildSchema(`
input UserLoginInput {
  email: String
  password: String
}
type AccessTokenData {
    token: String
    tokenType: String
}
type UserData {
    id: ID
}
type LoginUserData {
    user: UserData
    accessToken: AccessTokenData
}
type Mutation {
    loginUser(input: UserLoginInput): LoginUserData
}
type Query {
    sayHi: String
}
`);
const rootValue = {
    loginUser: ({ input }) => {
        if (!input.email)
            throw new Error('Email is required');
        if (!input.password)
            throw new Error('Password is required');
        const user = fakeDb.get(input.email);
        if (!user)
            throw new Error('User not found');
        if (input.password !== user.password)
            throw new Error('Incorrect password');
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_JWT_KEY);
        return {
            user: {
                id: user.id
            },
            accessToken: {
                token,
                tokenType: 'Bearer'
            }
        };
    },
    sayHi: () => 'Hello there!'
};
// const app = express()
// app.use(cors())
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     rootValue,
//     graphiql: true
//   })
// )
// app.listen(4000)
// console.log('Running a GraphQL API server at localhost:4000/graphql')
