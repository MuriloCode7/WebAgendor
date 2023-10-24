const mongoose = require('mongoose');
const URI = `mongodb+srv://web-agendor:${process.env.DATABASE_PASSWORD}@cluster0.dpof6ws.mongodb.net/web-agendor?retryWrites=true&w=majority`;
const URI_LOCAL=  `mongodb://127.0.0.1:27017/web-agendor-local`;

mongoose.connect(URI_LOCAL, { useNewUrlParser: true });
mongoose.connect(URI_LOCAL, { useCreateIndex: true });
mongoose.connect(URI_LOCAL, { useUnifiedTopology: true});

mongoose
  .connect(URI_LOCAL)
  .then(() => console.log('DB is up.'))
  .catch(() => console.log(err));
