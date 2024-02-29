import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphQLServer from "./graphql";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World! I am express server.");
  });

  app.use("/graphql", expressMiddleware(await createGraphQLServer()));

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

init();
