export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    schema: process.env.SCHEMA,
    entities: [__dirname + '/modules/**/domain/*.entity{.ts,.js}'],
    synchronize: process.env.SYNCHRONIZE === 'developer ' ? true : false,
  },
  secret: process.env.SECRETKEY,
});
