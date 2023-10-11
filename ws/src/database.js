const mongoose = require('mongoose');
const URI = `mongodb+srv://web-agendor:${process.env.DATABASE_PASSWORD}@cluster0.dpof6ws.mongodb.net/web-agendor?retryWrites=true&w=majority`;

mongoose.connect(URI, { useNewUrlParser: true });
mongoose.connect(URI, { useCreateIndex: true });
mongoose.connect(URI, { useUnifiedTopology: true});

mongoose
  .connect(URI)
  .then(() => console.log('DB is up.'))
  .catch(() => console.log(err));
