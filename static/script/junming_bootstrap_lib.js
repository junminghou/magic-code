var junming = (function () {
    var dataType = {
        int: "int",
        float: ["float", "double"],
        percent: ["percent", "percent|int", "percent|float", "percent|double"]
    };

    var inputType = {
        int: ["int", "percent|int"],
        float: ["float", "double", "percent|float", "percent|double"],
        text: "",
        xss: "xss"
    };

    var dateType = {
        days: {value: 0, text: "days"},
        months: {value: 1, text: "months"},
        years: {value: 2, text: "years"}
    };

    var setType = {
        "false": ["0", "false"],
        "true": ["1", "true"],
        true_def: ["2", "true-def"],
        true_null: ["3", "true-null"]
    };

    function QueryString(name) {
        var result = location.search.match(new RegExp("[\?\&#]" + name + "=([^\&#]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }

        return result[1];
    };

    function ParentQueryString(name) {
        try {
            var result = window.parent.location.search.match(new RegExp("[\?\&#]" + name + "=([^\&#]+)", "i"));
            if (result == null || result.length < 1) {
                return "";
            }

            return result[1];
        } catch (e) {

        }

        return "";
    };

    function GetAccessToken() {
        return junming.QueryString("ak") || junming.QueryString("accessToken") || junming.QueryString("accesstoken");
    };

    function GetUserToken() {
        var uk = junming.QueryString("uk") || junming.QueryString("userToken") || junming.QueryString("usertoken");
        if (junming.IsNullOrEmpty(uk)) {
            uk = junming.ParentQueryString("uk") || junming.ParentQueryString("userToken") || junming.ParentQueryString("usertoken");
        }

        if (junming.IsNullOrEmpty(uk)) {
            uk = frontendConfig.uk;
        }
        return uk;
    };

    function FilterXss(html) {
        if (IsNullOrEmpty(html)) {
            return html;
        }
        return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    function SetUrl_UserToken() {
        var userToken = GetUserToken();

        if (userToken) {
            return "userToken=" + GetUserToken();
        }

        return "";
    };

    function Contains(source, value, andor) {
        if (junming.IsNullOrEmpty(source)) {
            return false;
        }

        if (value.constructor == Array) {
            if (andor == "and" || andor == "&&") {
                var exitsLength = 0;
                for (var i = 0; i < value.length; i++) {
                    if (source == value[i] || source.indexOf(value[i]) > -1) {
                        ++exitsLength;
                    }
                }

                return value.length == exitsLength;
            } else {
                for (var i = 0; i < value.length; i++) {
                    if (source == value[i] || source.indexOf(value[i]) > -1) {
                        return true;
                    }
                }
            }
        } else if (value.constructor == String) {
            if (source == value || source.indexOf(value) > -1) {
                return true;
            }
        }

        return false;
    };

    function InArray(data, arrayData, mode) {
        if (arrayData.constructor == Array) {
            mode = EmptyDef(mode, "==");

            for (var i = 0; i < arrayData.length; i++) {
                var value = arrayData[i];
                if (mode == "==") {
                    if (data == value) {
                        return true;
                    }
                } else {
                    if (data == value || data.indexOf(value) > -1) {
                        return true;
                    }
                }
            }
        } else if (arrayData.constructor == String) {
            if (data == arrayData) {
                return true;
            }
        }

        return false;
    };

    function ArraySplice(array, value) {
        if (junming.IsNull(value)) {
            return;
        }
        if (value.constructor == Array) {
            for (var i = 0; i < array.length; i++) {
                if (value.indexOf(array[i]) > -1) {
                    array.splice(i, 1);
                    i--;
                }
            }
        } else {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == value) {
                    array.splice(i, 1);
                    return;
                }
            }
        }
    };

    function JoinUrl(url, key, value) {
        if (!junming.IsNullOrEmpty(url) && !junming.IsNullOrEmpty(key) && !junming.IsNullOrEmpty(value)) {
            if (url.indexOf(key + "=") > -1) {
                var result = "";
                var arrayA = url.split("?");
                var arrayB = arrayA[1].split("&");

                result = arrayA[0] + "?";

                for (var i = 0; i < arrayB.length; i++) {
                    if (junming.IsNullOrEmpty(arrayB[i])) {
                        continue;
                    }
                    var arrayC = arrayB[i].split("=");
                    if (junming.IsNullOrEmpty(arrayC)) {
                        continue;
                    }
                    if (junming.IsNullOrEmpty(arrayC[0])) {
                        continue;
                    }
                    if (arrayC[0] == key) {
                        arrayC[1] = value;
                    }

                    result += "&" + arrayC[0] + "=" + arrayC[1];
                }

                return result;
            }

            if (url.indexOf("?") > -1) {
                url += "&" + key + "=" + value;
            } else {
                url += "?" + key + "=" + value;
            }
        }

        return url;
    };

    function JoinUrl_UserToken(url) {
        if (url.indexOf("uk=") > -1 || url.indexOf("usertoken=") > -1 || url.indexOf("userToken=") > -1) {
            return url;
        }

        var userToken = junming.SetUrl_UserToken();
        if (url.indexOf("?") > -1 && !junming.IsNullOrEmpty(userToken)) {
            url += "&" + userToken;
        } else if (!junming.IsNullOrEmpty(userToken)) {
            url += "?" + userToken;
        }

        return url;
    };

    function ConcatStr(source, concat, appendBeforeOrAfter) {
        var result = "";
        isEmpty = isEmpty || true;
        appendBeforeOrAfter = appendBeforeOrAfter || true;

        if (!junming.IsNullOrEmpty(source)) {
            if (appendBeforeOrAfter) {

            }
            return source + concat;
        }
        return source;
    };

    function FilterProperties(from) {
        // 过滤所有为null,undefined的属性        
        var entity = {};

        if (from.constructor == Object) {
            for (var o in from) {
                if (!IsNull(from[o])) {
                    entity[o] = from[o];
                }
            }
        }

        return entity;
    };

    function UrlMapperEntity(url, mappingRelation, isDecode) {
        if (junming.IsNullOrEmpty(isDecode)) {
            isDecode = true;
        }

        // 过滤所有为null,undefined,""的属性
        var mapper = mappingRelation;
        var entity = {};
        var arrayStr = url.split('&');

        for (var i = 0; i < arrayStr.length; i++) {
            var keyVal = arrayStr[i].split('=');
            var newProperty = mapper[keyVal[0]];
            if (IsNullOrEmpty(newProperty)) {
                continue;
            }

            if (isDecode) {
                // unescape(decodeURI(keyVal[1]))
                AddPropertyAndValue(entity, newProperty, decodeURIComponent(keyVal[1]));
            } else {
                AddPropertyAndValue(entity, newProperty, keyVal[1]);
            }
        }

        return entity;
    };

    function AddPropertyAndValue(entity, newProperty, value) {
        // 为实体添加属性，该属性不能为null或undefined.
        if (newProperty.constructor == String) {
            if (IsNull(newProperty)) {
                return;
            }

            entity[newProperty] = value;
        }
    };

    function IsNullOrEmpty(val, returnVal) {
        if (val === null || val === undefined || val === "") {
            return true;
        }

        return false;
    };

    function IsNullOrEmpty_Return(val, def) {
        if (IsNullOrEmpty(val)) {
            if (IsNull(def)) {
                return "";
            }
            return def;
        }
        return val;
    };

    function EmptyDef(val, def) {
        return IsNullOrEmpty_Return(val, def);
    };
    //function NotEmptyDef(val, def) {
    //    if (!IsNullOrEmpty(val)) {
    //        return val + def;
    //    }
    //    return "";
    //};
    function IsNull(val) {
        if (val === null || val === undefined) {
            return true;
        }

        return false;
    };

    function IsFunction(object) {
        if (!junming.IsNull(object) && object.constructor == Function) {
            return true;
        }

        return false;
    };

    function IsNaN(value) {
        if (!isNaN(value)) {
            value = parseFloat(value);
        } else {
            value = 0;
        }
    };

    function FormatEntityArrayField(entity, filters) {
        if (junming.IsNull(entity)) {
            return;
        }
        for (var key in entity) {
            var valueOfkey = entity[key];
            if (junming.IsNull(valueOfkey)) {
                continue;
            }
            if (filters != null && filters.indexOf(key) > -1) {
                continue;
            }
            if (valueOfkey.constructor == Array) {
                var values = valueOfkey;
                var joinValues = "";
                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    joinValues += "," + value;
                }
                entity[key] = joinValues.substr(1);
            }
        }
    };

    function GetElementToEntity(className, arrayFormat) {
        var entity = {};
        arrayFormat = junming.EmptyDef(arrayFormat, "array");

        var texts = $(className + " input[type=text]," + className + " input[type=hidden]");
        $.each(texts, function (i, input) {
            var setTypeValue = $(input).attr("jm-set-type");
            if (!junming.IsNullOrEmpty(setTypeValue)) {
                if (InArray(setTypeValue, setType.false)) {
                    return true;
                }
            }

            var key = $(input).attr("name");
            if (!junming.IsNullOrEmpty(key)) {
                var value = $(input).val().trim();
                var private_type = $(input).attr("jm-input-type");
                if (!junming.IsNullOrEmpty(private_type)) {
                    if (private_type == dataType.int) {
                        if (junming.IsNullOrEmpty(value)) {
                            value = 0;
                        }
                        else if (!isNaN(value)) {
                            value = parseInt(value);
                        } else {
                            value = 0;
                        }
                    }
                    else if (InArray(private_type, dataType.float)) {
                        if (junming.IsNullOrEmpty(value)) {
                            value = 0;
                        }
                        else if (!isNaN(value)) {
                            value = parseFloat(value);
                        } else {
                            value = 0;
                        }
                    }
                    else if (InArray(private_type, dataType.percent)) {
                        if (junming.IsNullOrEmpty(value)) {
                            value = 0;
                        }
                        else if (!isNaN(value)) {
                            value = parseFloat(value) / 100.0;
                        } else {
                            value = 0;
                        }
                    }

                }

                entity[key] = value;
            }
        });

        var textareas = $(className + " textarea");
        $.each(textareas, function (i, textarea) {
            var setTypeValue = $(textarea).attr("jm-set-type");
            if (!junming.IsNullOrEmpty(setTypeValue)) {
                if (InArray(setTypeValue, setType.false)) {
                    return true;
                }
            }

            var key = $(textarea).attr("name");
            if (!junming.IsNullOrEmpty(key)) {
                entity[key] = $(textarea).val().trim();
            }
        });

        var checkboxs = $(className + " input[type=checkbox]:checked");
        $.each(checkboxs, function (i, checkbox) {
            var setTypeValue = $(checkbox).attr("jm-set-type");
            if (!junming.IsNullOrEmpty(setTypeValue)) {
                if (InArray(setTypeValue, setType.false)) {
                    return true;
                }
            }

            var name = $(checkbox).attr("name");
            var value = $(checkbox).val();
            if (!entity.hasOwnProperty(name)) {
                entity[name] = [];
            }
            entity[name].push(value);
        });

        var radios = $(className + " input[type=radio]:checked");
        $.each(radios, function (i, radio) {
            var setTypeValue = $(radio).attr("jm-set-type");
            if (!junming.IsNullOrEmpty(setTypeValue)) {
                if (InArray(setTypeValue, setType.false)) {
                    return true;
                }
            }

            var name = $(radio).attr("name");
            if (!junming.IsNullOrEmpty(name)) {
                entity[name] = $(radio).val();
            }
        });

        var selects = $(className + " select");
        $.each(selects, function (i, select) {
            var $select = $(select);
            var setTypeValue = $select.attr("jm-set-type");
            if (!junming.IsNullOrEmpty(setTypeValue)) {
                if (InArray(setTypeValue, setType.false)) {
                    return true;
                }
            }

            var name = $select.attr("name");
            if (!junming.IsNullOrEmpty(name)) {
                entity[name] = $select.val();
            }
        });

        if (arrayFormat == ",") {
            FormatEntityArrayField(entity)
        }

        return entity;
    };

    function SetElementVal(className, data, setter) {
        var isDisableICheck = false;
        var isAppend = false;
        if (!junming.IsNull(setter) && !junming.IsNull(setter.isDisableICheck) && setter.isDisableICheck.constructor == Boolean) {
            isDisableICheck = setter.isDisableICheck;
        }
        if (!junming.IsNull(setter) && !junming.IsNull(setter.isAppend) && setter.isAppend.constructor == Boolean) {
            isAppend = setter.isAppend;
        }

        for (var key in data) {
            var $element = $(className + " #" + key);
            var element = $element[0];

            if (junming.IsNull(element)) {
                $element = $(className + " input[name='" + key + "']");
                element = $element[0];
            }

            if (junming.IsNull(element)) {
                $element = $(className + " select[name='" + key + "']");
                element = $element[0];
            }

            if (junming.IsNull(element))
                continue;

            var type = $element.attr("type");
            if (type == "checkbox" || type == "radio") {
                continue;
            }

            var values = data[key];
            $element.val(values);

            if (element.tagName == "INPUT") {
                var private_type = EmptyDef($element.attr("jm-input-type"), "");
                if (private_type == inputType.text) {
                } else if (InArray(private_type, inputType.float)) {
                    InputDouble($element);
                } else if (InArray(private_type, inputType.int)) {
                    InputInt($element);
                }
            } else if (element.tagName == "SELECT" && element.multiple) {
                if (values.constructor == String)
                    $element.selectpicker('val', values.split(','));
                else
                    $element.selectpicker('val', values);
                $element.selectpicker('refresh');
            } else if (element.tagName == "SELECT" && $element.attr("class").indexOf("selectpicker") > -1) {
                $element.selectpicker('refresh');
            }
        }

        var checkboxs = $(className + " input[type=checkbox]");
        $.each(checkboxs, function (i, checkbox) {
            var name = $(checkbox).attr("name");
            var value = $(checkbox).val();
            if (data.hasOwnProperty(name)) {
                if (data[name].constructor == Array) {
                    if (data[name].indexOf(value) > -1) {
                        $(checkbox).iCheck('check');
                        disableICheck(isDisableICheck, $(checkbox));
                    } else if (!isAppend) {
                        $(checkbox).iCheck('uncheck');
                    }
                } else {
                    var temp = data[name].split(',');
                    if (temp.indexOf(value) > -1) {
                        $(checkbox).iCheck('check');
                        disableICheck(isDisableICheck, $(checkbox));
                    } else if (!isAppend) {
                        $(checkbox).iCheck('uncheck');
                    }
                }
            }
        });

        function disableICheck(isDisable, $iCheck) {
            if (isDisable) {
                $iCheck.iCheck('disable');
            }
        }

        var radios = $(className + " input[type=radio]");
        $.each(radios, function (i, radio) {
            var name = $(radio).attr("name");
            var value = $(radio).val();
            if (data.hasOwnProperty(name)) {
                if (value == data[name]) {
                    $(radio).iCheck('check');
                }
            }
        });
    };

    function ReplaceElement(parent, data) {
        var html = $(parent).html();
        $(parent).html("");
        $.each(data, function (i, entity) {
            var copy = html;

            for (var key in entity) {
                copy = copy.replace(eval("/{{" + key + "}}/gi"), entity[key]);
            }
            $(parent).append(copy);
        });
    }

    function SetGroupElementValue(parent, arrayData) {
        var copy = $(parent).html();
        $(parent).html("");
        $.each(arrayData, function (i, entity) {
            var html = "<div class='jm-element-group jm-element-group" + i + "'>" + copy + "</div>";
            $(parent).append(html);
        });
        $.each(arrayData, function (i, entity) {
            junming.SetElementVal(parent + " .jm-element-group" + i, entity);
        });
    }

    function GetGroupElementValue(parent, isSerialize) {
        var isTrue = junming.IsNullOrEmpty(isSerialize) ? false : isSerialize;
        var result = [];
        $.each($(parent + " .jm-element-group"), function (i, item) {
            var data = junming.ElementConvertEntity(parent + " .jm-element-group" + i);
            result.push(data);
        });

        if (isTrue) {
            return JSON.stringify(result);
        }

        return result;
    }

    function SetElementHtml(parent, data, filterArrray, filterType) {
        var parentObj = parent;
        if (parent.constructor == String) {
            parentObj = $(parent);
        }
        var type = ".";
        if (!junming.IsNullOrEmpty(filterType)) {
            if (filterType == "#" || filterType.toLowerCase() == "id") {
                type = "#";
            }
        }

        for (var key in data) {
            if (!junming.IsNull(filterArrray) && filterArrray.indexOf(key) > -1) {
                continue;
            }
            parentObj.find(type + key).html(junming.EmptyDef(data[key], ""));
        }
    }

    function InitElementVerify(className) {
        setTimeout(function () {
            var texts = $(className + " input[type=text]");
            $.each(texts, function (i, input) {
                var $element = $(input);
                var private_type = EmptyDef($element.attr("jm-input-type"), "");
                if (private_type == inputType.text) {

                } else if (private_type == inputType.xss) {
                    InputBindXss($element);
                } else if (InArray(private_type, inputType.float)) {
                    InputDouble($element);
                } else if (InArray(private_type, inputType.int)) {
                    InputInt($element);
                }
                var date_format = private_type;
                if (date_format != "") {
                    var jsonValOne = {
                        todayBtn: "linked",
                        language: "cn",
                        autoclose: true,
                        clearBtn: true,
                        todayHighlight: true
                    };
                    var is_date_format = false;
                    if (date_format == "yyyy") {
                        jsonValOne.startView = dateType.years.value;
                        jsonValOne.minViewMode = dateType.years.value;
                        is_date_format = true;
                    } else if (date_format == "yyyy-mm") {
                        jsonValOne.startView = dateType.months.value;
                        jsonValOne.minViewMode = dateType.months.value;
                        is_date_format = true;
                    } else if (date_format == "yyyy-mm-dd") {
                        jsonValOne.startView = dateType.days.value;
                        jsonValOne.minViewMode = dateType.days.value;
                        is_date_format = true;
                    }
                    if (is_date_format) {
                        jsonValOne.format = date_format;
                        $element.attr("readonly", "readonly");
                        $element.datepicker(jsonValOne);
                    }
                }
            });
        }, 200);
    };

    function GetValues(source, keys) {
        if (junming.IsNull(keys) || junming.IsNull(source)) {
            return "";
        }
        var values = "";
        for (var i = 0; i < keys.length; i++) {
            for (var j = 0; j < source.length; j++) {
                if (keys[i] == source[j].key) {
                    values += "," + source[j].value;
                }
            }
        }
        return values.substr(1, values.length);
    };

    function EntityMapperUrl(entity, delFirstChar, format_array, excludeVal) {
        var url = "";
        var char = "&";
        var isDelete = junming.IsNullOrEmpty(delFirstChar) ? false : delFirstChar;
        format_array = junming.EmptyDef(format_array, "&");

        if (entity.constructor == Object) {
            for (var key in entity) {
                var values = entity[key];

                if (IsNullOrEmpty(values) || values == excludeVal) {
                    continue;
                }

                if (values.constructor == Array) {
                    var joinValue = "";
                    for (var i = 0; i < values.length; i++) {
                        if (format_array == "&") {
                            url += (char + key + "=" + values[i]);
                        } else if (format_array == ",") {
                            joinValue += "," + values[i];
                        }
                    }

                    if (format_array == ",") {
                        url += (char + key + "=" + joinValue.substr(1));
                    }
                    continue;
                }

                // 非Array执行
                url += (char + key + "=" + values);
            }

            if (isDelete && url.length > 1 && url.substr(0, 1) == '&') {
                url = url.substr(1);
            }
        }

        return url;
    };

    function Listening(Listener, callBack, setIntervalue) {
        if (Listener.constructor !== Object && !Listener.hasOwnProperty("data")) {
            alert("参数'Listener'必须是一个对象,并且包含data属性(具体监听的数据)");
            return;
        }

        if (!IsNull(Listener.data)) {
            callBack(Listener.data);
            return;
        }

        // 设置默认间隔
        var interval = setIntervalue || 100;

        // 每隔[interval]毫秒执行一次,判断是否有值,若有则跳出        
        var tempID = setInterval(function () {
            if (!IsNull(Listener.data)) {
                clearInterval(tempID);
                callBack(Listener.data);
            }
        }, interval);

        // 超时时间限制, 默认10秒, 若10秒内都没有监听到值, 则直接跳出
        setTimeout(function () {
            clearInterval(tempID);
            //alert("callBack");
            console.log("未监听到数据");
            callBack(null);
        }, 10000);
    };

    function setInterval(intervalCall, successCall, interval, keepSecond) {
        // 设置默认间隔
        interval = parseInt(junming.EmptyDef(interval, 30));
        keepSecond = parseInt(junming.EmptyDef(keepSecond, 5 * 1000));

        var tempID = window.setInterval(function () {
            if (intervalCall()) {
                if (!junming.IsNull(successCall)) {
                    successCall();
                }
                window.clearInterval(tempID);
                window.clearTimeout(tempTimeout);
            }
        }, interval);

        // 超时时间限制, 默认5秒, 若5秒内都没有监听到值, 则直接跳出
        var tempTimeout = setTimeout(function () {
            window.clearInterval(tempID);
            window.clearTimeout(tempTimeout);
            console.warn("超时, 未监听到数据" + fff);
        }, keepSecond);

        var fff = junming_date.toString("fff");
        console.groupCollapsed("监听器" + fff);
        console.trace('调用堆栈');
        console.groupEnd();
    };

    function InputDouble($obj) {
        if (IsNullOrEmpty($obj[0])) {
            return;
        }
        $obj.bind('input propertychange', function () {
            this.value = this.value.replace(/[^\d\.-]/g, "");
        });
    };

    function InputBindXss($obj) {
        if (IsNullOrEmpty($obj[0])) {
            return;
        }
        $obj.bind('input propertychange', function () {
            this.value = this.value.replace(/</g, '');
            this.value = this.value.replace(/>/g, '');
        });
    }

    function InputInt($obj) {
        if (IsNullOrEmpty($obj[0])) {
            return;
        }
        $obj.bind('input propertychange', function () {
            this.value = this.value.replace(/[^\d]/g, "");
        });
    };

    function ToggleValueV2(element, jsonObj) {
        var $obj = $(element);
        var value = $obj.attr(jsonObj.attr);
        var value1 = jsonObj.value1;
        var value2 = jsonObj.value2;
        var defValue = jsonObj.defValue;

        if (!IsNullOrEmpty(value)) {
            if (value == value1) {
                $obj.attr(jsonObj.attr, value2);
                if (!IsNull(jsonObj.value2Callback)) {
                    jsonObj.value2Callback(value1, value2);
                }
            } else if (value == value2) {
                $obj.attr(jsonObj.attr, value1);
                if (!IsNull(jsonObj.value1Callback)) {
                    jsonObj.value1Callback(value1, value2);
                }
            }
        } else if (!IsNullOrEmpty(defValue)) {
            $obj.attr(jsonObj.attr, defValue);
            if (!IsNull(jsonObj.defValueCallback)) {
                jsonObj.defValueCallback(defValue);
            }
        }
    };

    function ToggleValue(element, attribute, value1, value2, defValue) {
        var $obj = $(element);
        var value = $obj.attr(attribute);
        if (!IsNullOrEmpty(value)) {
            if (value == value1) {
                $obj.attr(attribute, value2);
            } else if (value == value2) {
                $obj.attr(attribute, value1);
            }
        } else if (!IsNullOrEmpty(defValue)) {
            $obj.attr(attribute, defValue);
        }
        return $obj.attr(attribute);
    };

    /* 例子：
        var value = 2; var def = "无";
        var data = [
            { min: 1, max: 3, text: "低层" },
            { min: 4, max: 6, text: "多层" }
        ];
    */
    function RangeGetText(data, value, def) {
        for (var i = 0; i < data.length; i++) {
            var o = data[i];
            value = parseInt(value);
            if (value >= parseInt(o.min) && value <= parseInt(o.max)) {
                return o.text;
            }
        }

        return def;
    };

    function SetRandomValue(entity, keyLoad) {
        for (var key in entity) {
            if (!junming.IsNull(keyLoad) && !keyLoad(key)) {
                continue;
            }
            if (typeof (entity[key]) == "string") {
                entity[key] = "test" + Math.ceil(Math.random() * 100);
            } else if (typeof (entity[key]) == "number") {
                entity[key] = Math.ceil(Math.random() * 100);
            }
        }
    };

    function RandomValue(min, max, type) {
        var range = parseInt(max) - parseInt(min);

        var result = Math.random() * range + min;

        if (InArray(type, inputType.float)) {
            return parseFloat(result.toFixed(2));
        }

        return parseInt(result);
    };

    function PrivateRandomRangeValue(min, max, input_type) {
        var value = 0;
        var ut_min = parseInt(junming.EmptyDef(min, -1));
        var ut_max = parseInt(junming.EmptyDef(max, -1));
        if (ut_min == -1 && ut_max == -1) {
            value = RandomValue(0, 100);
        }
        else if (ut_min == -1 && ut_max != -1) {
            value = RandomValue(0, ut_max + 1);
        }
        else if (ut_min != -1 && ut_max == -1) {
            value = RandomValue(ut_min, ut_min + 500);
        } else if (ut_min != -1 && ut_max != -1) {
            value = RandomValue(ut_min, ut_max + 1);
        }

        return value;
    }

    function autoSetElements(parent) {
        var className = parent;

        var texts = $(className + " input[type=text]");
        var date = junming_date.toString("hhmmss");
        $.each(texts, function (i, text) {
            var $element = $(text);

            if (setType.false.indexOf(junming.EmptyDef($element.attr("jm-enable-ut"), "true")) > -1) {
                return true;
            }

            var private_type = junming.EmptyDef($element.attr("jm-input-type"), "");
            if (private_type == inputType.text) {
                var ut_text = junming.EmptyDef($element.attr("jm-ut-text"), "test");
                $element.val(ut_text + date);
            } else if (InArray(private_type, inputType.float)) {
                var value = PrivateRandomRangeValue($element.attr("jm-ut-min"), $element.attr("jm-ut-max"), inputType.float);
                $element.val(value);
            } else if (InArray(private_type, inputType.int)) {
                if ($element.attr("id") == "housePerFloor") {
                    var test = 1;
                }
                var value = PrivateRandomRangeValue($element.attr("jm-ut-min"), $element.attr("jm-ut-max"), inputType.int);
                $element.val(value);
            } else if (private_type == "yyyy" || private_type == "yyyy-mm" || private_type == "yyyy-mm-dd") {
                $element.val(junming_date.toString(private_type.replace(/mm/, "MM")));
            }
        });

        var checkboxs = $(className + " input[type=checkbox]");
        var checkbox_names = [];
        $.each(checkboxs, function (i, checkbox) {
            var name = $(checkbox).attr("name");
            if (checkbox_names.indexOf(name) > -1) {
                return true;
            }
            checkbox_names.push(name);
            var targetCheckboxs = $(className + " input[name=" + name + "]");
            var values = [];
            $.each(targetCheckboxs, function (j, targetCheckbox) {
                values.push($(targetCheckbox).val());
            });

            var length = RandomValue(1, values.length + 1);
            var setValues = [];
            for (var j = 0; j < length; j++) {
                var index = RandomValue(0, values.length);
                setValues.push(values.splice(index, 1)[0]);
            }

            $.each(targetCheckboxs, function (j, targetCheckbox) {
                if (setValues.indexOf($(targetCheckbox).val()) > -1) {
                    $(targetCheckbox).iCheck('check');
                } else {
                    $(targetCheckbox).iCheck('uncheck');
                }
            });
        });

        var radios = $(className + " input[type=radio]");
        var radio_names = [];
        $.each(radios, function (i, radio) {
            var name = $(radio).attr("name");
            if (radio_names.indexOf(name) > -1) {
                return true;
            }
            radio_names.push(name);
            var targetRadios = $(className + " input[name=" + name + "]");
            var values = [];
            $.each(targetRadios, function (j, targetRadio) {
                values.push($(targetRadio).val());
            });

            var radom_value = values[RandomValue(0, values.length)];

            $.each(targetRadios, function (j, targetRadio) {
                if ($(targetRadio).val() == radom_value) {
                    $(targetRadio).iCheck('check');
                    return false;
                }
            });
        });

        autoSetSelects(className);

        var select_multiples = $(className + " select[multiple]");
        $.each(select_multiples, function (i, select_multiple) {
            var $select_multiple = $(select_multiple);
            var options = $select_multiple.find("option");
            var values = [];

            $.each(options, function (j, option) {
                var value = $(option).val();
                values.push(value);
            });
            var temp = RandomValue(1, values.length + 1);
            var random_Length = myRandom($select_multiple.attr("jm-ut-min"), $select_multiple.attr("jm-ut-max"), temp, values.length);

            var setValues = [];
            for (var j = 0; j < random_Length; j++) {
                var random_index = RandomValue(0, values.length);
                setValues.push(values.splice(random_index, 1)[0]);
            }
            $select_multiple.selectpicker('val', setValues);
            $select_multiple.selectpicker('refresh');
        });

        function myRandom(min, max, def, arrayLength) {
            var ut_min = parseInt(junming.EmptyDef(min, -1));
            var ut_max = parseInt(junming.EmptyDef(max, -1));
            if (ut_min == -1 && ut_max == -1) {
                return def;
            } else if (ut_min != -1 && ut_max != -1) {
                return RandomValue(ut_min, ut_max + 1);
            } else if (ut_min == -1) {
                return RandomValue(1, ut_max + 1);
            } else if (ut_max == -1) {
                return RandomValue(ut_min, arrayLength);
            }

            return RandomValue(ut_min, ut_max);
        }
    };

    function autoSetSelects(className) {
        var selects = $(className + " select");
        if (selects.length == 0) {
            return;
        }

        // 获取带有父级的元素
        var childSelects = {};
        $.each(selects, function (i, select) {
            var $select = $(select);
            if ($select.attr("multiple")) {
                return true;
            }

            var parent = $select.attr("jm-ut-parent");
            if (!junming.IsNullOrEmpty(parent)) {
                childSelects[parent] = $select;
                $select.html("");
                return true;
            }
            setSelectRandomValue($select);
        });

        // 获取根元素
        var rootSelects = {};
        for (var key in childSelects) {
            var $parent = $("#" + key);
            var root = getRoot($parent);
            var rootId = root.attr("id");
            if (rootSelects.hasOwnProperty(rootId)) {
                continue;
            }
            rootSelects[rootId] = root;
        }
        // 根据根元素往下找每个子元素
        for (var key in rootSelects) {
            var root = rootSelects[key];
            setChildValue(root, childSelects);
        }

        function getRoot($parent) {
            var parent_name = $parent.attr("jm-ut-parent");
            if (!junming.IsNullOrEmpty(parent_name)) {
                return getRoot($(parent_name));
            }

            return $parent;
        }

        function setChildValue(parent, childSelects) {
            junming.setInterval(function () {
                if (junming.IsNullOrEmpty(parent))
                    return true;

                if (parent.children().length > 1) {
                    return true;
                }
                return false;
            }, function () {
                setSelectRandomValue(parent);
                parent.trigger("change");
                var child = childSelects[parent.attr("id")];
                if (junming.IsNullOrEmpty(child)) {
                    return;
                }
                setChildValue(child, childSelects);
            });
        }

        function setSelectRandomValue($select) {
            var childs = $select.find("option");
            if (childs.length == 0) return true;
            var random_index = junming.RandomValue(0, childs.length);
            var values = [];
            $.each(childs, function (j, option) {
                values.push($(option).val());
            });
            $select.val(values[random_index]);
        }
    }

    function copyEntityValue(source, target) {
        for (var key in source){
            target[key] = source[key];
        }
    }

    function initRangeArray(min, max) {
        var arrayVal = [];
        for (var i = min; i <= max; i++) {
            arrayVal.push(i);
        }
        return arrayVal;
    }

    return {
        QueryString: QueryString,
        ParentQueryString: ParentQueryString,
        GetAccessToken: GetAccessToken,
        GetUserToken: GetUserToken,
        FilterXss: FilterXss,
        SetUrl_UserToken: SetUrl_UserToken,
        Contains: Contains,
        InArray: InArray,
        JoinUrl: JoinUrl,
        JoinUrl_UserToken: JoinUrl_UserToken,
        ConcatStr: ConcatStr,
        FilterProperties: FilterProperties,
        UrlMapperEntity: UrlMapperEntity,
        AddPropertyAndValue: AddPropertyAndValue,
        IsNullOrEmpty: IsNullOrEmpty,
        IsNullOrEmpty_Return: IsNullOrEmpty_Return,
        EmptyDef: EmptyDef,
        IsNull: IsNull,
        IsFunction: IsFunction,
        IsNaN: IsNaN,
        ElementConvertEntity: GetElementToEntity,
        FormatEntityArrayField: FormatEntityArrayField,
        SetElementVal: SetElementVal,
        SetElementHtml: SetElementHtml,
        ReplaceElement: ReplaceElement,
        SetGroupElementValue: SetGroupElementValue,
        GetGroupElementValue: GetGroupElementValue,
        GetValues: GetValues,
        EntityMapperUrl: EntityMapperUrl,
        Listening: Listening,
        ToggleValue: ToggleValue,
        ToggleValueV2: ToggleValueV2,
        InitElementVerify: InitElementVerify,
        RangeGetText: RangeGetText,
        SetRandomValue: SetRandomValue,
        ArraySplice: ArraySplice,
        autoSetElements: autoSetElements,
        initRangeArray: initRangeArray,
        RandomValue: RandomValue,
        setInterval: setInterval
    };
})();

var test = function () {
    junming.InArray("a", ["a"]);
};

var junming_Math = (function () {
    function SignFigures(num, rank) {
        rank = junming.IsNullOrEmpty_Return(rank, 6);
        if (!num) return (0);
        const sign = num / Math.abs(num);
        const number = num * sign;
        const temp = rank - 1 - Math.floor(Math.log10(number));
        let ans;
        if (temp > 0) {
            ans = parseFloat(number.toFixed(temp));
        } else if (temp < 0) {
            const temp = Math.pow(10, temp);
            ans = Math.round(number / temp) * temp;
        } else {
            ans = Math.round(number);
        }
        return (ans * sign);
    }

    return {
        SignFigures: SignFigures
    };
})();

var junming_cache = (function () {
    var cacheRange = {
        session: 0,
        local: 1,
    };

    function set(key, value, range) {
        if (value == undefined) {
            return get(key, null, range);
        }
        if (typeof (Storage) !== "undefined") {
            switch (range) {
                case cacheRange.local:
                    localStorage.setItem(key, value);
                    break;
                default:
                    sessionStorage.setItem(key, value);
                    break;
            }
        }
    };

    function get(key, defVal, range) {
        defVal = junming.EmptyDef(defVal, "");
        if (typeof (Storage) !== "undefined") {
            var value = null;
            switch (range) {
                case cacheRange.local:
                    value = localStorage.getItem(key);
                    break;
                default:
                    value = sessionStorage.getItem(key);
                    break;
            }

            return junming.EmptyDef(value, defVal);
        }
    };

    function remove(key) {
        if (typeof (Storage) !== "undefined") {
            switch (range) {
                case cacheRange.local:
                    localStorage.removeItem(key);
                    break;
                default:
                    sessionStorage.removeItem(key);
                    break;
            }
        }
    };

    function setLocal(key, value) {
        return set(key, value, cacheRange.local);
    };

    function getLocal(key, defVal) {
        return get(key, defVal, cacheRange.local)
    };

    function removeLocal() {
        set(key, cacheRange.local);
    };

    function setSession(key, value) {
        return set(key, value, cacheRange.session);
    };

    function getSession(key, defVal) {
        return get(key, defVal, cacheRange.session)
    };

    function removeSession() {
        set(key, cacheRange.session);
    };

    return {
        SetLocal: setLocal,
        GetLocal: getLocal,
        RemoveLocal: removeLocal,
        SetSession: setSession,
        GetSession: getSession,
        RemoveSession: removeSession,
    };
})();

var junming_date = (function () {
    function toString(format) {
        if (format === undefined || format === null || format === "") {
            return "yyyy-MM-dd HH:mm:ss";
        }

        var current = new Date();
        format = format.replace(/yyyy/g, current.getFullYear());
        format = format.replace(/yyy/g, current.getYear());
        format = format.replace(/yy/g, current.getFullYear().toString().slice(-2));

        if (format.indexOf('mi') >= 0) {
            format = format.replace(/mi/g, current.getMilliseconds().toString());
        }

        if (format.indexOf('M') >= 0) {
            var M = (current.getMonth() + 1).toString();
            format = format.replace(/MM/g, ("0" + M).slice(-2));
            format = format.replace(/M/g, M);
        }

        if (format.indexOf('ddd') >= 0) {
            var xq = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
            format = format.replace(/ddd/g, xq[current.getDay()]);
        }

        if (format.indexOf('d') >= 0) {
            var d = current.getDate().toString();
            format = format.replace(/dd/g, ("0" + d).slice(-2));
            format = format.replace(/d/g, d);
        }


        if (format.indexOf('h') >= 0 || format.indexOf('H') >= 0) {
            var h = current.getHours().toString();
            format = format.replace(/HH/g, ("0" + h).slice(-2));
            format = format.replace(/H/g, h);
            h = h % 12;
            format = format.replace(/hh/g, ("0" + h).slice(-2));
            format = format.replace(/h/g, h);
        }

        if (format.indexOf('m') >= 0) {
            var m = current.getMinutes().toString();
            format = format.replace(/mm/g, ("0" + m).slice(-2));
            format = format.replace(/m/g, m);
        }

        if (format.indexOf('s') >= 0) {
            var s = current.getSeconds().toString();
            format = format.replace(/ss/g, ("0" + s).slice(-2));
            format = format.replace(/s/g, m);
        }

        if (format.indexOf('f') >= 0) {
            var f = current.getMilliseconds().toString();
            format = format.replace(/fff/g, ("000" + f).slice(-3));
            format = format.replace(/ff/g, ("000" + f).slice(-3).substr(0, 2));
            format = format.replace(/f/g, ("000" + f).slice(-3).substr(0, 1));
        }
        //.getMilliseconds()

        return format;
    };

    return {
        toString
    };
})();