import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import mongoose from "mongoose";
import userRepository from "../helpers/user";
import db from "./db";

let Mutation = {
  newNote: async (parent, args, { models, user }) => {
    userRepository.checkUserSigned(user);
    return await models.Note.create({
      content: args.content,
      author: new mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    userRepository.checkUserSigned(user);

    let note = await models.Note.findById({ _id: id });

    if (note) userRepository.checkUserOwnerNote(user, note);

    let deleteOne = await models.Note.deleteOne({ _id: id });
    return !!deleteOne.deletedCount;
  },
  updateNote: async (parent, { id, content }, { models, user }) => {
    userRepository.checkUserSigned(user);
    let note = await models.Note.findById({ _id: id });
    if (note) userRepository.checkUserOwnerNote(user, note);

    try {
      return await models.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
        { new: true }
      );
    } catch (err) {
      console.error(err);
    }
  },

  signUp: async (parent, { username, email, password }, { models }) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const avatar = gravatar.url(email);

    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.error(err);
      throw new Error("Error signUp");
    }
  },

  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase();

    const user = await models.User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) throw new AuthenticationError("AuthenticationError");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthenticationError("AuthenticationError");

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },

  toggleFavorite: async (parent, { id }, { models, user }) => {
    userRepository.checkUserSigned(user);
    let noteCheck = await models.Note.findById({ _id: id });
    let hasUser = noteCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0)
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: { favoritedBy: new mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: -1 },
        },
        { new: true }
      );
    else
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: { favoritedBy: new mongoose.Types.ObjectId(user.id) },
          $inc: { favoriteCount: 1 },
        },

        { new: true }
      );
  },
};

Mutation = { ...Mutation, ...db };

export default Mutation;
