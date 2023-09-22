import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const userType = new GraphQLObjectType({
    name: "userType",
    fields:
    {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        gender: { type: GraphQLString },
        id: { type: GraphQLID },
    }
})