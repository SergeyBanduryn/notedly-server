import { AuthenticationError, ForbiddenError } from "apollo-server-express";

class userRepository {
  static checkUserSigned(user) {
    if (!user) throw new AuthenticationError("Вы должны быть авторизованы");
  }
  static checkUserOwnerNote(user, note) {
    if (String(note.author) !== user.id)
      throw new ForbiddenError("У вас нет прав");
  }
}

export default userRepository;
