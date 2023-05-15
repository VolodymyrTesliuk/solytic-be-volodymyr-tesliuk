"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
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
type AccessToken {
    token: String
    tokenType: String
}
type User {
    id: ID
}
type LoginUser {
    user: User
    accessToken: AccessToken
}
type Mutation {
    loginUser(input: UserLoginInput): LoginUser
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
const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
