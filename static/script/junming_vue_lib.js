let junming = (function () {

    function QueryString(name, isDecode) {
        var result = location.hash.match(new RegExp('[\?\&#]' + name + '=([^\&#]+)', 'i'));
        if (result == null || result.length < 1) {
            return '';
        }

        return decodeURIComponent(result[1]);
    }

    function IsNull(val) {
        return (val === null || val === undefined);
    }

    function IsNullOrEmpty(val, returnVal) {
        return (val === null || val === undefined || val === '');
    }

    function EmptyDef(val, def) {
        if (IsNullOrEmpty(val)) {
            if (IsNull(def)) {
                return '';
            }
            return def;
        }
        return val;
    }

    function ToUrl(entity, delFirstChar, formatArray, excludeVal) {
        if (IsNullOrEmpty(entity)) return '';
        let url = '';
        let char = '&';
        let isDelete = IsNullOrEmpty(delFirstChar) ? false : delFirstChar;
        formatArray = EmptyDef(formatArray, '&');

        if (entity.constructor === Object) {
            for (let key in entity) {
                let values = entity[key];

                if (IsNullOrEmpty(values) || values == excludeVal) {
                    continue;
                }

                if (values.constructor === Array) {
                    let joinValue = '';
                    for (let i = 0; i < values.length; i++) {
                        if (formatArray === '&') {
                            url += (char + key + '=' + values[i]);
                        } else if (formatArray === ',') {
                            joinValue += (',' + values[i]);
                        }
                    }

                    if (formatArray == ',') {
                        url += (char + key + '=' + joinValue.substr(1));
                    }
                    continue;
                }

                // 非Array执行
                url += (char + key + '=' + values);
            }

            if (isDelete && url.length > 1 && url.substr(0, 1) === '&') {
                url = url.substr(1);
            }
        }

        return url;
    }

    function Convert(data, convertOne, pageIndex, pageSize) {
        var result = {Items: [], Count: 0};

        if (junming.IsNull(data)) {
            return result;
        }

        var itemsKey = '';
        var countKey = '';
        if (data.hasOwnProperty('Items')) {
            itemsKey = 'Items';
        } else if (data.hasOwnProperty('items')) {
            itemsKey = 'items';
        }
        if (data.hasOwnProperty('Count')) {
            countKey = 'Count';
        } else if (data.hasOwnProperty('count')) {
            countKey = 'count';
        }

        if (!junming.IsNullOrEmpty(data[itemsKey])) {
            var items = data[itemsKey];

            var idx = 1;
            if (!junming.IsNullOrEmpty(pageIndex) && !junming.IsNullOrEmpty(pageSize)) {
                try {
                    idx = (pageIndex - 1) * pageSize + 1;
                } catch (e) {
                }
            }

            for (var i = 0; i < items.length; i++) {
                var entiy = convertOne(items[i]);
                entiy['_index'] = (idx += (i == 0 ? 0 : 1));

                result.Items.push(entiy);
            }

            result.Count = data[countKey] || 0;
            return result;
        }

        if (!junming.IsNullOrEmpty(data[countKey]) && junming.IsNullOrEmpty(data[itemsKey])) {
            return result;
        }

        if (data.constructor === Object) {
            result.Items.push(convertOne(data));
            result.Count = 1;

            return result;
        }

        if (data.constructor === Array) {
            for (var i = 0; i < data.length; i++) {
                var entiy = convertOne(data[i]);

                result.Items.push(entiy);
            }
            result.Count = data.length;

            return result;
        }

        return result;
    }

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
    }

    function CopyEntityValue(source, target) {
        for (let key in source) {
            target[key] = source[key];
        }
    }

    function eachChildData(data, callback) {
        let me = this;
        if (callback !== null) {
            let result = junming.EmptyDef(callback(data), true);
            if (!result) {
                return;
            }
        }

        if (data.constructor === Array) {
            eachRow(data);
        } else if (data.constructor === Object && !junming.IsNull(data.children) && data.children.constructor === Array) {
            eachRow(data.children);
        }

        function eachRow(arrayData) {
            for (let i = 0; i < arrayData.length; i++) {
                let row = arrayData[i];
                me.eachChildData(row, callback);
            }
        }
    }

    function GetValues(source, keys) {
        if (junming.IsNull(keys) || junming.IsNull(source)) {
            return '';
        }
        let values = '';
        for (let i = 0; i < keys.length; i++) {
            for (let j = 0; j < source.length; j++) {
                if (keys[i] == source[j].key) {
                    values += (',' + source[j].value);
                }
            }
        }
        return values.substr(1, values.length);
    }

    const dictionary = {
        get(source, compareKey, keyName, valueName) {
            if (junming.IsNull(keyName) || junming.IsNull(source)) {
                return '';
            }
            let values = '';
            for (let j = 0; j < source.length; j++) {
                if (source[j][keyName] == compareKey) {
                    values += (',' + source[j][valueName]);
                }
            }
            return values.substr(1, values.length);
        },
    };

    return {
        ToUrl,
        EmptyDef,
        IsNullOrEmpty,
        IsNull,
        Convert,
        QueryString,
        ArraySplice,
        CopyEntityValue,
        eachChildData,
        GetValues,
        dictionary,
    };

})();