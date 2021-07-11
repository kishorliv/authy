require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const app = require('./src/app');
const { connectDB } = require('src/helpers/db');

const PORT = process.env.PORT || 3000;

connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Server started in port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
