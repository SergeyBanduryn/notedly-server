import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import http from "http";
// import router from "./routes/users";

const port = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

import mongoose from "mongoose";

import models from "./models";
import typeDefs from "./schema";
import resolvers from "./resolvers";

import jwt from "jsonwebtoken";
import helmet from "helmet";
import cors from "cors";

import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

// let notes = [
//   { id: "1", content: "This is a note", author: "Adam Scott" },
//   { id: "2", content: "This is another note", author: "Harlow Everly" },
//   { id: "3", content: "Oh hey look, another note!", author: "Riley Harrison" },
// ];

// app.use("/users", usersRouter);

function getUser(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    new Error("Error jwt.verify");
  }
}

async function startApolloServer() {
  try {
    await mongoose.connect(DB_HOST);
  } catch (e) {
    console.log(e);
  }

  const app = express();
  app.use(cors());
  // app.use(helmet());

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req }) => {
      const token = req.headers.authorization;

      let user;
      if (token) user = getUser(token);

      // console.log(req.headers);
      // if (user) console.log(user);
      return { models, user };
    },
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app, path: "/" });
  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startApolloServer();
