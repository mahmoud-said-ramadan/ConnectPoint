import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } from 'graphql';
import { userQueryFields } from '../src/modules/user/user.graphQL.router.js';

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query122',
        fields: {
            ...userQueryFields
        },
    }),
});