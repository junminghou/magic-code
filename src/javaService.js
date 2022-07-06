import { MenuItem } from "iview";

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
  getMemberVariable(divContent) {
    let inner = divContent.replace('\n', '').trim();
    let member = dataConvert.getDuringStr(inner, "private", ";", false);

    let definition = member.split(' ');
    return { memberType: definition[0], memberName: definition[1] }
  },
  getMethod(divContent, filterColumns) {
    let inner = divContent.replace('\n', '').trim();
    let columnBody = dataConvert.getDuringStr(inner, "(", ")", false);
    let methodName = dataConvert.getDuringStr(inner, " ", "(", false);
    let returnType = dataConvert.getDuringStr(inner, "", " ", false);
    let methodOutType = this.getJavaType(returnType);

    let arrayColumns = columnBody.split(',');
    let methodInParams = [];
    let me = this;
    arrayColumns.forEach(function (value) {
      if (value === "") return;

      let fields = value.trim().split(' ');
      let field = {};
      field.type = fields[0];
      field.name = fields[1];
      let paramDefinition = me.getJavaInParamType(field.type);
      methodInParams.push({ paramType: field.type, paramName: field.name, paramDefinition });
    });


    let methodDefinition = { methodName: methodName, methodOutType: methodOutType, methodInParams: methodInParams };
    console.log(methodDefinition);
    return methodDefinition;
  },
  getTableByJavaClass(divContent, filterColumns) {
    let create = "class";
    let comment = "/**";
    let lowercaseComment = "comment";
    let primaryKey = "PRIMARY KEY";
    let constraint = "CONSTRAINT";
    let decimal = "DECIMAL";

    let tables = [];
    if (divContent == undefined || divContent == null || divContent == '') {
      return tables;
    }

    let sourceStr = divContent.replace('\n', '');
    sourceStr.split('}').forEach(inner => {
      if (inner.trim() == '') {
        return;
      }
      let tableName = "";
      inner += "}";
      tableName = dataConvert.getDuringStr(inner, create, "{");
      if (tableName == '') {
        return;
      }
      let columnBody = dataConvert.getDuringStr(inner, "{", "}", true);
      if (columnBody == '') {
        return '';
      }
      let temp = inner.substring(inner.lastIndexOf("}"));
      let tableDesc = "";

      if (temp.indexOf(lowercaseComment) > -1) {
        comment = lowercaseComment;
      }
      if (temp.indexOf(comment) > -1) {
        tableDesc = dataConvert.getDuringStr(temp.split(comment)[1], "'", "'", true);
      }
      tableDesc = (tableDesc == '' ? tableName : tableDesc);
      let table = { name: tableName, description: tableDesc, columns: [] };

      let arrayColumns = columnBody.split(';');
      arrayColumns.forEach(function (value) {
        if (value === "") return;

        if (value.indexOf(constraint) > -1) {
          return;
        }
        let column = {};
        value = value.trim();
        value = value.replace('unsigned', '');

        let specialType = dataConvert.getSpecialType(value);     
        value = specialType.value;
        let arrayResult = value.split(" ");
        let columnName = arrayResult[arrayResult.length - 1];
        if (columnName === '') {
          return;
        }
        if (filterColumns.indexOf(columnName) > -1) {
          return;
        }

        let dataType = arrayResult[arrayResult.length - 2];
        let desc = "";

        if (value.indexOf(comment) > -1) {
          desc = dataConvert.getDuringStr(value, "/**", "*/");
          desc = desc.replace('\n', '').replace('*', '').trim();
        }
        column.name = columnName;
        column.pascalName = dataConvert.getPascalNameForJava(columnName);
        column.dataType = dataType;
        column.description = desc;
        column.camelName = dataConvert.getCamelName(columnName);
        column.specialType = specialType.specialFiled;
        column.isPK = false;

        table.columns.push(column);
        if (value.indexOf(primaryKey) > -1 || value.indexOf(primaryKey.toLocaleLowerCase()) > -1) {
          table.primaryKey = columnName;
          table.primaryKeyType = dataType;
          table.primaryKeyCamel = column.camelName;
          column.isPK = true;
        }
      });
      table.pascalName = dataConvert.getPascalNameForJava(table.name);
      table.camelName = dataConvert.getCamelName(table.pascalName);
      tables.push(table);
    });

    return tables;
  },
  getTable(element, filterColumns) {
    if (element == undefined || element == null || element == '') {
      return [];
    }
    let create = "CREATE TABLE";
    let comment = "COMMENT";
    let lowercaseComment = "comment";
    let primaryKey = "PRIMARY KEY";
    let constraint = "CONSTRAINT";
    let decimal = "DECIMAL";

    let tables = [];
    element.split(';').forEach(function (divContent) {
      if (divContent.trim() == '') {
        return;
      }
      let inner = divContent.replace('\n', '');
      let tableName = "";
      if (inner.indexOf(create) > -1) {
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

      let table = { name: tableName, description: tableDesc, columns: [] };

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
        } else if (arrayColumns[i].indexOf(decimal) > -1 || arrayColumns[i].indexOf(decimal.toLocaleLowerCase()) > -1 ) {
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
        value = value.replace('unsigned', '');
        let columnName = dataConvert.getDuringStr(value, null, " ");
        if (columnName === '') {
          return;
        }
        if (filterColumns.indexOf(columnName) > -1) {
          return;
        }

        let specialType = dataConvert.getSpecialType(value);
        value = specialType.value;
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
        column.specialType = specialType.specialFiled;
        column.isPK = false;

        table.columns.push(column);
        if (value.indexOf(primaryKey) > -1 || value.indexOf(primaryKey.toLocaleLowerCase()) > -1) {
          table.primaryKey = columnName;
          table.primaryKeyType = dataType;
          table.primaryKeyCamel = column.camelName;
          column.isPK = true;
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
  getPascalNameForJava(name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  },
  getCamelName(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
  },
  toUpperCase(str) {
    return str.toLowerCase().replace(/(_|^)[a-z]/g, (L) => L.toUpperCase());
  },
  getSpecialType(value){
    const specialType = { money: false, like: false, percent: false, time: false, isIn: false, value:'' };
    
    if (value.indexOf("@money") > -1) {
      specialType.money = true;
      value = value.replace(/@money/g,'');
    }
    if (value.indexOf("@like") > -1) {
      specialType.like = true;
      value = value.replace(/@like/g,'');
    }
    if (value.indexOf("@percent") > -1) {
      specialType.percent = true;
      value = value.replace(/@percent/g,'');
    }
    if (value.indexOf("@time") > -1) {
      specialType.time = true;
      value = value.replace(/@time/g,'');
    }
    if (value.indexOf("@in") > -1) {
      specialType.isIn = true;
      value = value.replace(/@in/g,'');
    }
    return { specialFiled: specialType, value: value.trim() };
  },
  getDataType(value) {
    if (value.indexOf(dataType.java.String) > -1 || value.indexOf(dataType.java.String.toLocaleLowerCase()) > -1) {
      return "String";
    }
    if (value.indexOf(dataType.java.Long) > -1 || value.indexOf(dataType.java.Long.toLocaleLowerCase()) > -1) {
      return "Long";
    }
    if (value.indexOf(dataType.java.Integer) > -1 || value.indexOf(dataType.java.Integer.toLocaleLowerCase()) > -1) {
      return "Integer";
    }
    if (value.indexOf(dataType.java.Date) > -1 || value.indexOf(dataType.java.Date.toLocaleLowerCase()) > -1) {
      return "LocalDateTime";
    }
    if (value.indexOf(dataType.java.Timestamp) > -1 || value.indexOf(dataType.java.Timestamp.toLocaleLowerCase()) > -1) {
      return "LocalDateTime";
    }
    if (value.indexOf(dataType.java.BigDecimal) > -1 || value.indexOf(dataType.java.BigDecimal.toLocaleLowerCase()) > -1) {
      return "BigDecimal";
    }
    return "String";
  },
  getJavaType(value) {
    let methodOutType = { isBaseType: true, isReferenceType: false, isList: false, outTypeValue: '' };

    if (value.indexOf("List<") > -1) {
      methodOutType.isReferenceType = true;
      methodOutType.isList = true;
      methodOutType.isBaseType = false;
    }

    let hasBaseType = false;
    if (value.indexOf("String") > -1 || value.indexOf("string") > -1) {
      methodOutType.outTypeValue = "String";
      hasBaseType = true;
    }
    if (value.indexOf("Long") > -1 || value.indexOf("long") > -1) {
      methodOutType.outTypeValue = "Long";
      hasBaseType = true;
    }
    if (value.indexOf("Integer") > -1 || value.indexOf("int") > -1) {
      methodOutType.outTypeValue = "Integer";
      hasBaseType = true;
    }
    if (value.indexOf("Boolean") > -1 || value.indexOf("boolean") > -1) {
      methodOutType.outTypeValue = "Boolean";
      hasBaseType = true;
    }
    if (value.indexOf("BigDecimal") > -1) {
      methodOutType.outTypeValue = "BigDecimal";
      hasBaseType = true;
    }

    if (!hasBaseType) {
      methodOutType.outTypeValue = this.getDuringStr(value, "<", ">");
    }
    methodOutType.outTypeSource = value;
    return methodOutType;
  },
  getJavaInParamType(value) {
    let methodInType = { isBaseType: true, isReferenceType: false, isList: false };

    let hasBaseType = false;
    if (value.indexOf("String") > -1 || value.indexOf("string") > -1) {
      hasBaseType = true;
    }
    if (value.indexOf("Long") > -1 || value.indexOf("long") > -1) {
      hasBaseType = true;
    }
    if (value.indexOf("Integer") > -1 || value.indexOf("int") > -1) {
      hasBaseType = true;
    }
    if (value.indexOf("Boolean") > -1 || value.indexOf("boolean") > -1) {
      hasBaseType = true;
    }
    if (value.indexOf("BigDecimal") > -1) {
      hasBaseType = true;
    }

    if (!hasBaseType) {
      methodInType.isBaseType = false;
      methodInType.isReferenceType = true;
    }

    return methodInType;
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

