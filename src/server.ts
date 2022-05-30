import "dotenv/config";
import app from "./app";

const PORT = Object(process.env).PORT as number;
const HOST = Object(process.env).HOST as string;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
