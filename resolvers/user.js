// import { Types } from "Mongoose";
// const ObjectId = Types.ObjectId;

const User = {
  notes: async (user, { offset, limit }, { models }) => {
    let notes = await models.Note.find({ author: user._id })
      .skip(offset)
      .limit(limit)
      .sort({ _id: -1 });
    return notes;
  },
  favorites: async (user, { offset, limit }, { models }) => {
    return await models.Note.find({ favoritedBy: user._id })
      .skip(offset)
      .limit(limit)
      .sort({ _id: -1 });
  },
  totalNotes: async (user, args, { models }) => {
    let countDocuments = await models.Note.find({
      author: user._id,
    }).countDocuments();
    // console.log(countDocuments);
    return countDocuments;
  },
  totalFavorites: async (user, args, { models }) => {
    return await models.Note.find({
      favoritedBy: user._id,
    }).countDocuments();
  },
};

export default User;
