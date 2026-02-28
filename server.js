import { app } from "./app.js";
import { config, connectDB } from "./config/index.js";

const start = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server is listening at http://localhost:${config.PORT}`);
  });
};

start()