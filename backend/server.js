import server from "./app.js";
import { connectDB } from "./config/db.js";

const serverStar = server.listen(process.env.PORT, async (err) => {
  if (err) {
    console.log(`Server failed with error ${err}`);
  } else {
    await connectDB();
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
  }
});
