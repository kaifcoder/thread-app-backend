import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { db } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
        type Mutation {
            createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
        }
    `, // Schema
    resolvers: {
      Query: {
        hello: () => "Hello World! I am a graphql server.",
        say: (_, { name }) => `Hello ${name}!`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await db.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "1234",
            },
          });
          console.log(firstName, lastName, email, password);
          return true;
        },
      },
    }, // Actual implementation
  });
  await gqlServer.start();

  app.get("/", (req, res) => {
    res.send("Hello World! I am express server.");
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

init();
