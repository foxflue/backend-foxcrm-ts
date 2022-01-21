import axios from "axios";

export default async () => {
  const url: string = `https://api.vercel.com/v1/integrations/deploy/prj_NINi8Y375EgydH09CR4lzcRZ0RWj/jVxJuyzSvB`;
  try {
    await axios.post(url);
    return true;
  } catch (err) {
    console.log(err);
  }
};
