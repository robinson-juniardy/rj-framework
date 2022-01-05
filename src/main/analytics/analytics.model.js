import { Analytics } from "../../store/application.store.js";

export default {
  getAnalytics: () => {
    let Model = new Analytics();
    Model.registerField([Model]);
    Model.map();
    return Model.sql;
  },
};
