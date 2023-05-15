declare const express: any;
declare const graphqlHTTP: any;
declare const buildSchema: any;
declare const jwt: any;
declare const cors: any;
declare const SECRET_JWT_KEY: string | undefined;
declare const initialData: {
    'voltes@gmail.com': {
        id: number;
        email: string;
        password: string;
    };
};
declare const fakeDb: Map<string, {
    id: number;
    email: string;
    password: string;
}>;
declare const schema: any;
declare const rootValue: {
    loginUser: ({ input }: {
        input: any;
    }) => {
        user: {
            id: number;
        };
        accessToken: {
            token: any;
            tokenType: string;
        };
    };
    sayHi: () => string;
};
