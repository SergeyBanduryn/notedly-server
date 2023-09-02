const Query = {
  // notes: async (parent, args, { models }) => {
  //   return await models.Note.find().sort({ _id: 1 });
  // },
  note: async (parent, args, { models }) => await models.Note.findById(args.id),
  user: async (parent, { username }, { models }) =>
    await models.User.findOne({ username }),
  users: async (parent, args, { models }) =>
    await models.User.find().limit(100),
  me: async (parent, args, { models, user }) => {
    let userFind = await models.User.findById(user.id);
    return userFind;
  },
  notes: async (parent, { offset, limit }, { models }) =>
    await models.Note.find().skip(offset).limit(limit).sort({ _id: -1 }),
  totalNotes: async (parent, args, { models }) =>
    await models.Note.find().estimatedDocumentCount(),
};

export default Query;
