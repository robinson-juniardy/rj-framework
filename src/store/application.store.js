import Model from "../lib/application.model.js";

/**
 * Create new Store Class Here
 * */

class Analytics extends Model {
  constructor() {
    super();
    this.schema = {
      name: "DGI_API_LOG_REQUEST",
      field: {
        ID: new Number(),
        KD_DEALER: new String(),
        REQUEST_TIME: new String(),
        REQUEST_STATUS: new String(),
        ENDPOINT: new String(),
        IP_ADDRESS: new String(),
        USER_AGENT: new String(),
        CREATED_TIME: new String(),
      },
    };
  }
}

/**
 * then export Store
 */
export { Analytics };
