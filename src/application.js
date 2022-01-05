import sql from "mssql";
import { settings } from "./settings.js";
const Application = {
  db: {
    execute: (query) => {
      return new Promise(async (resolve, reject) => {
        let pool = await sql.connect(settings.database);
        try {
          const request = pool.request();
          const result = await request.query(query);
          resolve({
            status: true,
            message: "success",
            data: result.recordset,
          });
        } catch (error) {
          reject({
            status: false,
            message: error,
            data: [],
          });
        } finally {
          pool.close();
        }
      });
    },
  },
};

export default Application;
