require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");

// routers
const companysRouter = require("./routes/companies.routes");
const specialtiesRouter = require("../src/routes/specialties.routes");
const timeTablesRouter = require("../src/routes/timeTables.routes");
const colaboratorsRouter = require("../src/routes/colaborators.routes");
const customersRouter = require("../src/routes/customers.routes");
const schedulesRouterv= require('../src/routes/schedules.routes');

require("../src/database");

// Middlewares
// Uso do morgan no ambiente dev para acompanhamento das requisicoes
app.use(morgan("dev"));
/* Aqui dizemos para express que trabalharemos com requisicoes por meio de json */
app.use(express.json());
app.use(busboy());
app.use(busboyBodyParser());
app.use(cors());

// Variables
app.set("port", 8000);

app.use("/companies", companysRouter);
app.use("/specialties", specialtiesRouter);
app.use("/timeTables", timeTablesRouter);
app.use("/colaborators", colaboratorsRouter);
app.use("/customers", customersRouter);
app.use('/schedules', schedulesRouterv);

app.listen(app.get("port"), () => {
  console.log(`WS listening on port ${app.get("port")}✅`);
});
