import Query from "./query";
import Mutation from "./mutation";
import Note from "./note";
import User from "./user";
import { DateTimeScalar } from "graphql-date-scalars";

const resolvers = {
  Query,
  Mutation,
  Note,
  User,
  DateTime: DateTimeScalar,
};

export default resolvers;
