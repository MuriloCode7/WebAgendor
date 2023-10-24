const mongoose = require('mongoose');
const URI_ONLINE = `mongodb+srv://web-agendor:${process.env.DATABASE_PASSWORD}@cluster0.dpof6ws.mongodb.net/web-agendor?retryWrites=true&w=majority`;
const URI_LOCAL=  `mongodb://127.0.0.1:27017/web-agendor-local`;
const URI = process.env.ENVIRONMENT === 'online' ? URI_ONLINE : URI_LOCAL;

mongoose.connect(URI, { useNewUrlParser: true });
mongoose.connect(URI, { useCreateIndex: true });
mongoose.connect(URI, { useUnifiedTopology: true});

mongoose
  .connect(URI)
  .then(() => console.log('DB is up.'))
  .catch(() => console.log(err));
