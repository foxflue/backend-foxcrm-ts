import axios from "axios";
import { AppError } from "../AppError.utils";
import { upsertUser } from "./upsertUser";

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
    // 1) Send a request to gitub server to get a access_token
    const response = await axios.post(url, values, {
      headers: {
        Accept: "application/json",
      },
    });
    // 2) Send the access_token to github server to get user details
    const githubUser = await githubUserDetails(response.data.access_token);

    // 3) If there email exist on user account
    if (!githubUser.email) {
      throw new AppError(
        "Unable to create account: Unverified amazon account",
        406
      );
    }

    return await upsertUser(githubUser.id, githubUser.email, githubUser.name);
  } catch (err) {
    console.log(err);
    throw err;
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
