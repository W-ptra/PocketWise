const Hapi = require("@hapi/hapi");
const dotenv = require("dotenv");
const routersPlugin = require("./router/routers");
const { requestTimeCounting,logMiddleware } = require("./middleware/logger");
const { authentication } = require("./middleware/authentication");
const { notFound } = require("./middleware/notFound");
dotenv.config();

const init = async () => {
  console.log(process.env.CORS)
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        headers: ["Authorization", "Content-Type"],
        
      }
    }
  });
  
  server.ext("onRequest", requestTimeCounting);
  server.ext("onRequest",authentication);

  server.ext("onPreResponse", logMiddleware)
  server.ext("onPreResponse", notFound)
  await server.register({
    plugin: routersPlugin,
  });

  await server.start();
  console.log(
    "Registered Routes:",
    server.table().map((route) => `${route.method.toUpperCase()} ${route.path}`)
  );
  console.log("Server running on %s", server.info.uri);
};

init();