const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const routersPlugin = require("./router/routers");
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
  });

  await server.register({
    plugin: routersPlugin,
  });

  await server.start();
  console.log(
    "Registered Routes:",
    server.table().map((route) => route.path)
  );
  console.log("Server running on %s", server.info.uri);
};

init();
