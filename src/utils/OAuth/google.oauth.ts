import axios from "axios";
import { AppError } from "../AppError.utils";
import { upsertUser } from "./upsertUser";

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
    // 1) Google provide a access_token
    const response = await axios.post(url, values);

    // 2) Send the token to google server to get user details
    const googleUser = await getGoogleUserProfile(response.data.access_token);

    // 3) Check email available or not
    if (!googleUser.email_verified) {
      throw new AppError(
        "Unable to create account: Unverified google account",
        406
      );
    }

    return await upsertUser(googleUser.sub, googleUser.email, googleUser.name);
  } catch (error) {
    throw error;
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
