import mongoose from "mongoose";
import userRepository from "../helpers/user";

const db = {
  addFakeNotes: async (parent, args, { models, user }) => {
    userRepository.checkUserSigned(user);

    let content = await models.Note.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(user.id) } },
      { $group: { _id: null, content: { $max: { $toInt: "$content" } } } },
      { $project: { _id: 0, content: 1 } },
    ])
      .then((res) => Math.ceil(res[0].content / 10) * 10)
      .catch((err) => 0);

    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        content: String(content + i),
        author: new mongoose.Types.ObjectId(user.id),
      });
    }

    let notes = await models.Note.insertMany(arr);
    return !!notes;
  },
  deleteAllNotes: async (parent, args, { models, user }) => {
    userRepository.checkUserSigned(user);
    let deleteMany = await models.Note.deleteMany({
      author: new mongoose.Types.ObjectId(user.id),
    });
    return !!deleteMany.deletedCount;
  },
};

export default db;
