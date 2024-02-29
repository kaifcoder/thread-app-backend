import { ApolloServer } from "@apollo/server";
import { db } from "../lib/db";
import { user } from "./user";

async function createGraphQLServer() {
  const gqlServer = new ApolloServer({
    typeDefs: `
            ${user.typeDefs}
            type Query {
                ${user.queries}
            }
            type Mutation {
        
                ${user.mutations}
            }
        `,
    resolvers: {
      Query: {
        ...user.resolvers.queries,
      },
      Mutation: {
        ...user.resolvers.mutations,
      },
    },
  });
  await gqlServer.start();

  return gqlServer;
}

export default createGraphQLServer;
