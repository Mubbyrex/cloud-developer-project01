export const config = {
  dev: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: "mubarakdb03",
    host: "mubarakdb03.c1z08ey8ykpq.us-east-1.rds.amazonaws.com",
    dialect: "postgres",
    aws_region: process.env.AWS_REGION,
    aws_profile: process.env.AWS_PROFILE,
    aws_media_bucket: "my-091294840794-bucket-dev",
  },
  jwt: {
    secret: "Hello World ",
  },
  prod: {
    username: "",
    password: "",
    database: "udagram_prod",
    host: "",
    dialect: "postgres",
  },
};
