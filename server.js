require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}.`);
});
