import axios from "axios";
import { User } from "./../model/user.model";

export const loginWithGoogle = async (
  code: string,
  client_id: string,
  redirect_uri: string
) => {
  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code: code,
    client_id: client_id,
    redirect_uri: redirect_uri,
    client_secret: Object(process.env).GOOGLE_CLIENT_SECRET,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(url, values);
    return await getGoogleUserProfile(response.data.access_token);
  } catch (error) {
    throw error;
  }
};

export const loginWithFacebook = async (
  code: string,
  client_id: string,
  redirect_uri: string
) => {
  const url = "https://graph.facebook.com/v6.0/oauth/access_token";
  const values = {
    code: code,
    client_id: client_id,
    redirect_uri: redirect_uri,
    client_secret: Object(process.env).FACEBOOK_CLIENT_SECRET,
  };

  try {
    const response = await axios.get(url, { params: values });
    return await getFacebookUserProfile(response.data.access_token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginWithGithub = async (
  code: string,
  client_id: string,
  redirect_uri: string
) => {
  const url = "https://github.com/login/oauth/access_token";

  const values = {
    client_id: client_id,
    code: code,
    redirect_uri: redirect_uri,
    client_secret: Object(process.env).GITHUB_CLIENT_SECRET,
  };
  try {
    const response = await axios.post(url, values, {
      headers: {
        Accept: "application/json",
      },
    });
    const userDetails = githubUserDetails(response.data.access_token);
    return userDetails;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getGoogleUserProfile = async (accessToken: string) => {
  const url = "https://www.googleapis.com/oauth2/v3/userinfo";
  const values = {
    access_token: accessToken,
  };

  try {
    const response = await axios.get(url, { params: values });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getFacebookUserProfile = async (accessToken: string) => {
  const url = "https://graph.facebook.com/v6.0/me";
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const githubUserDetails = async (accessToken: string) => {
  const url = "https://api.github.com/user";
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      id: response.data.id,
      name: response.data.name,
      email: response.data.email,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

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
