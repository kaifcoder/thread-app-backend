import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

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
    `, // Schema
    resolvers: {
      Query: {
        hello: () => "Hello World! I am a graphql server.",
        say: (_, { name }) => `Hello ${name}!`,
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
