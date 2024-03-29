const dataType = {
  java: {
    String: "VARCHAR",
    Date: "DATE",
    Integer: "INT",
    Long: "BIGINT",
    Timestamp: "TIMESTAMP",
    BigDecimal: "DECIMAL"
  }
};

export const dataConvert = {
  getTable(element, filterColumns) {
    let create = "CREATE TABLE";
    let comment = "COMMENT";
    let lowercaseComment = "comment";
    let primaryKey = "PRIMARY KEY";
    let constraint = "CONSTRAINT";
    let decimal = "DECIMAL";

    let tables = [];
    element.split(';').forEach(function (divContent) {
      let inner = divContent.replace('\n', '');
      let tableName = "";
      if(inner.indexOf(create) > -1) {
        tableName = dataConvert.getDuringStr(inner, create, "(");
      } else {
        tableName = dataConvert.getDuringStr(inner, create.toLocaleLowerCase(), "(");
      }
      let columnBody = dataConvert.getDuringStr(inner, "(", ")", true);
      let temp = inner.substring(inner.lastIndexOf(")"));
      let tableDesc = "";
      
      if (temp.indexOf(lowercaseComment) > -1) {
        comment = lowercaseComment;
      }
      if (temp.indexOf(comment) > -1) {
        tableDesc = dataConvert.getDuringStr(temp.split(comment)[1], "'", "'", true);  
      }

      let table = {name: tableName, description: tableDesc, columns: []};

      let arrayColumns = columnBody.split(',');
      let index = 0;
      let isStart = 0;
      for (let i = 0; i < arrayColumns.length; i++) {
        if (isStart === 1) {
          arrayColumns[index] += "," + arrayColumns[i];
          if (arrayColumns[i].indexOf('\'') > -1) {
            isStart = 0;
          }
          arrayColumns[i] = "";
        }
        if (arrayColumns[i].indexOf(comment) > -1) {
          let comment_value = dataConvert.getDuringStr(arrayColumns[i], comment, '\'', true);

          if (comment_value.split('\'').length !== 2) {
            index = i;
            isStart = 1;
          }
        } else if (arrayColumns[i].indexOf(decimal) > -1) {
          if ((arrayColumns[i].indexOf(")") === -1)) {
            arrayColumns[i] += ("," + arrayColumns[i + 1]);
            arrayColumns[i + 1] = "";
            --i;
          }
        }
      }

      arrayColumns.forEach(function (value) {
        if (value === "") return;

        if (value.indexOf(constraint) > -1) {
          return;
        }
        let column = {};
        value = value.trim();
        value = value.replace('unsigned','');
        let columnName = dataConvert.getDuringStr(value, null, " ");
        if (columnName === '') {
          return;
        }
        if (filterColumns.indexOf(columnName) > -1) {
          return;
        }

        let dataType = dataConvert.getDataType(value);
        let desc = "";

        if (value.indexOf(comment) > -1) {
          desc = dataConvert.getDuringStr(value.split(comment)[1], "'", "'", true);
        }
        column.name = columnName;
        column.pascalName = dataConvert.getPascalName(columnName);
        column.dataType = dataType;
        column.description = desc;
        column.camelName = dataConvert.getCamelName(column.pascalName);

        table.columns.push(column);
        if (value.indexOf(primaryKey) > -1 || value.indexOf(primaryKey.toLocaleLowerCase()) > -1) {
          table.primaryKey = columnName;
          table.primaryKeyType = dataType;
          table.primaryKeyCamel = column.camelName;
        }
      });
      table.pascalName = dataConvert.getPascalName(table.name);
      table.camelName = dataConvert.getCamelName(table.pascalName);
      tables.push(table);
    });
    return tables;
  },
  getPascalName(name) {
    return dataConvert.toUpperCase(name).replace(/_/g, '');
  },
  getCamelName(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
  },
  toUpperCase(str) {
    return str.toLowerCase().replace(/(_|^)[a-z]/g, (L) => L.toUpperCase());
  },
  getDataType(value) {
    if (value.indexOf(dataType.java.String) > -1 || value.indexOf(dataType.java.String.toLocaleLowerCase()) > -1 ) {
      return "String";
    }
    if (value.indexOf(dataType.java.Long) > -1 || value.indexOf(dataType.java.Long.toLocaleLowerCase()) > -1 ) {
      return "Long";
    }
    if (value.indexOf(dataType.java.Integer) > -1 || value.indexOf(dataType.java.Integer.toLocaleLowerCase()) > -1) {
      return "Integer";
    }
    if (value.indexOf(dataType.java.Date) > -1 || value.indexOf(dataType.java.Date.toLocaleLowerCase()) > -1) {
      return "Date";
    }
    if (value.indexOf(dataType.java.Timestamp) > -1 || value.indexOf(dataType.java.Timestamp.toLocaleLowerCase()) > -1) {
      return "Date";
    }
    if (value.indexOf(dataType.java.BigDecimal) > -1 || value.indexOf(dataType.java.BigDecimal.toLocaleLowerCase()) > -1) {
      return "BigDecimal";
    }
    return "String";
  },
  getDuringStr(source, beginStr, endStr, isLastIndexOf) {
    let beginLength = beginStr ? beginStr.length : 0;
    let beginIndex = beginStr ? source.indexOf(beginStr) : 0;
    let endIndex = source.indexOf(endStr);
    if (isLastIndexOf) {
      endIndex = source.lastIndexOf(endStr);
    }

    return source.substring(beginIndex + beginLength, endIndex).trim();
  }
};

