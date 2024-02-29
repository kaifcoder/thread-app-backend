import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQLServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World! I am express server.");
  });

  app.use(
    "/graphql",
    expressMiddleware(await createGraphQLServer(), {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        if (!token) {
          return {};
        }
        const user = await UserService.decodeToken(token);
        return { user };
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

init();
