import { User } from "../../model/user.model";

// Upsert User
export const upsertUser = async (
  oauth_id: string,
  email: string,
  name: string
) => {
  let user;

  user = await User.findOne({ email });

  // If User dosen't exist, create new user
  if (!user) {
    user = await User.create({
      name,
      email,
      oauth_id,
    });
    return user;
  }

  // If User exist, and oauthId is not set, update oauthId
  if (!user.oauth_id) {
    user.oauth_id = oauth_id;
    await user.save();
    return user;
  }

  // If User exist, and oauthId is set, match oauthId return user
  if (user.oauth_id !== oauth_id) {
    return false;
  }

  return user;
};
