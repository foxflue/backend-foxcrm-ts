import axios from "axios";
import { AppError } from "../AppError.utils";
import { upsertUser } from "./upsertUser";

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
    // 1) Facebook provide a access token
    const response = await axios.get(url, { params: values });

    // 2) Send the token to facebook server to user details
    const facebookUser = await getFacebookUserProfile(
      response.data.access_token
    );

    // 3) Check if the user email available
    if (!facebookUser.email && !facebookUser.id) {
      throw new AppError(
        "Unable to create account: Facebook account does not have email",
        400
      );
    }

    return await upsertUser(
      facebookUser.id,
      facebookUser.email,
      facebookUser.name
    );
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
