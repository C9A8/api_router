
import {config}  from "./config/env";
import app from "./app";
import { addPasswordColumn } from "./db_schema/alterSchema";
// import { finalSchema } from "./db_schema/schema";
// finalSchema();
//addPasswordColumn(); 
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})