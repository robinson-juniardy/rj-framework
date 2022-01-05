class Model {
  /**
   *
   * @param {Array} _schema
   * @returns
   */
  constructor(_schema) {
    this.schema = _schema;
    this.sql = String();
    this.register = Array();
    this.field = Array();
    this.param_case = String();
    this.paramsCondition = Array();
    return this;
  }

  init = () => {
    console.log(this.schema);
  };

  /**
   * @author Robby Juniardi
   * @param {string} type
   * @example model.map('DISTINCT')
   * @returns query
   */
  map = (type) => {
    var keys = Object.keys(this.schema.field);
    var name = this.schema.name;
    return (this.sql += `SELECT ${!type ? "" : type} ${
      this.param_case !== "" ? `${this.param_case},` : ""
    } ${this.field} FROM ${name}\n`);
  };

  registerKey = (key) => {
    return (this.register = [...key]);
  };

  /**
   *
   * @param {Array} key reference of class field
   * @example
   * let customer = new MasterCustomer()
   * let address  = new CustomerAddress()
   * customer.registerField([customer, address])
   * @description register field of class reference
   */
  registerField = (key) => {
    for (var i = 0; i < key.length; i++) {
      for (var a = 0; a < Object.keys(key[i].schema.field).length; a++) {
        this.field = this.field.concat(
          `${key[i].schema.name}.${Object.keys(key[i].schema.field)[a]}`
        );
      }
    }
  };

  /**
   * @author Robby Juniardi
   * @description
   * @example
   * const InsertCustomer = (params) => {
   * let model = new Customer()
   * model.schema.field.name    = params.name
   * model.schema.field.age     = params.age
   * model.schema.field.address = params.address
   * model.insert()
   * return model.sql
   * }
   * @returns model.sql
   */

  insert = () => {
    let keys = [];
    var values = [];
    for (var key in this.schema.field) {
      if (typeof this.schema.field[key] !== "object") {
        keys.push(key);
        values.push(this.schema.field[key]);
      }
    }
    let val = [];
    for (var i = 0; i < values.length; i++) {
      if (typeof values[i] === "string") {
        val.push(`"${values[i]}"`);
      }
      if (typeof values[i] === "number") {
        val.push(`${values[i]}`);
      }
      if (typeof values[i] === "boolean") {
        val.push(`${values[i]}`);
      }
    }

    return (this.sql += `INSERT INTO ${this.schema.name} (${keys}) VALUES (${val})`);
  };

  update = (condition) => {
    let set = Object.keys(this.schema.field).map((key) => [
      key,
      this.schema.field[key],
    ]);
    let keybinding = [];
    for (var i = 0; i < set.length; i++) {
      if (typeof set[i][1] === "string") {
        keybinding.push(`${set[i][0]}="${set[i][1]}"`);
      }
      if (typeof set[i][1] === "number") {
        keybinding.push(`${set[i][0]}=${set[i][1]}`);
      }
      if (typeof set[i][1] === "boolean") {
        keybinding.push(`${set[i][0]}=${set[i][1]}`);
      }
    }

    return (this.sql += `UPDATE ${this.schema.name} SET ${keybinding} ${
      condition ? `WHERE ${condition}` : ""
    }`);
  };

  join = (modelname, source_name, { key = [] } = {}) => {
    this.left = () => {
      this.sql += `LEFT JOIN ${source_name.schema.name} ON ${source_name.schema.name}.${key[1]} = ${modelname.schema.name}.${key[0]}\n`;
    };
    this.inner = () => {
      this.sql += `INNER JOIN ${source_name.schema.name} ON ${source_name.schema.name}.${key[1]} = ${modelname.schema.name}.${key[0]}\n`;
    };
    this.right = () => {
      this.sql += `RIGHT JOIN ${source_name.schema.name} ON ${source_name.schema.name}.${key[1]} = ${modelname.schema.name}.${key[0]}\n`;
    };
    this.name = "";

    return this;
  };

  order = (key) => {
    this.descending = () => {
      this.sql += `ORDER BY ${key} DESC\n`;
    };
    this.ascending = () => {
      this.sql += `ORDER BY ${key} ASC\n`;
    };
    return this;
  };

  group = () => {
    return (this.sql += `GROUP BY ${this.field} \n`);
  };
  delete = (condition) => {
    return (this.sql += `DELETE FROM ${this.schema.name} ${
      !condition ? "" : `WHERE ${condition}`
    }\n`);
  };
  limit = (offset, fetch) => {
    return (this.sql += `OFFSET ${offset} ROWS ${
      !fetch ? "" : `FETCH NEXT ${fetch} ROWS ONLY`
    }\n`);
  };
  condition = (condition) => {
    return (this.sql += `WHERE ${condition ? `${condition}` : ``} \n`);
  };

  switch = () => {
    this.begin = () => {
      this.param_case += `CASE \n`;
    };
    this.end = (aliases) => {
      this.param_case += `END AS ${aliases} \n`;
    };
    return this;
  };
  case = (field, condition) => {
    this.then = (transform) => {
      let form;
      let conditionValue;
      if (typeof condition === "string") {
        conditionValue = `'${condition}'`;
      }
      if (typeof condition === "number") {
        conditionValue = `${condition}`;
      }
      if (typeof condition === "boolean") {
        conditionValue = `${condition}`;
      }
      if (typeof transform === "string") {
        form = `'${transform}'`;
      }
      if (typeof transform === "number") {
        form = `${transform}`;
      }
      if (typeof transform === "boolean") {
        form = `${transform}`;
      }
      this.param_case += `WHEN ${field} = ${conditionValue} THEN ${form} \n`;
    };
    return this;
  };
  params = (params, nestedValue) => {
    for (var key in params.schema.field) {
      if (typeof params.schema.field[key] !== "object") {
        if (params.schema.field[key] === "IS NOT NULL") {
          this.paramsCondition.push(`${params.schema.name}.${key} IS NOT NULL`);
        } else if (params.schema.field[key] === "IS NULL") {
          this.paramsCondition.push(`${params.schema.name}.${key} IS NULL`);
        } else if (params.schema.field[key] === "IN") {
          if (typeof params.schema.field[key] === "string") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} IN('${nestedValue}')`
            );
          }
          if (typeof params.schema.field[key] === "number") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} IN(${nestedValue})`
            );
          }
          if (typeof params.schema.field[key] === "boolean") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} IN(${nestedValue})`
            );
          }
        } else {
          if (typeof params.schema.field[key] === "string") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} = '${params.schema.field[key]}'`
            );
          }
          if (typeof params.schema.field[key] === "number") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} = ${params.schema.field[key]}`
            );
          }
          if (typeof params.schema.field[key] === "boolean") {
            this.paramsCondition.push(
              `${params.schema.name}.${key} = ${params.schema.field[key]}`
            );
          }
        }
      }
    }
  };
  renderParams = () => {
    for (var i = 0; i < this.paramsCondition.length; i++) {
      if (i + 1 == this.paramsCondition.length) {
        this.sql += `${this.paramsCondition[i]} \n`;
      } else {
        this.sql += `${this.paramsCondition[i]} AND \n`;
      }
    }
  };
}
export default Model
