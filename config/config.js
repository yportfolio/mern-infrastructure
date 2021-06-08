const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "Your JWT SECRET",
  mongoUri:
    "mongodb+srv://ye:wy6524615@cluster0.mbuii.mongodb.net/mern-infra?retryWrites=true&w=majority",
};

export default config;
