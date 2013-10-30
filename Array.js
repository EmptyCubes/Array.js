/************************
 * Provides IEnumerable for the js Array
 * 
 *
 * Authors: KodingSykosis & OhRyanOh
 * https://github.com/KodingSykosis
 * https://github.com/OhRyanOh
 ***/

//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

//From http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function () {
    var hash = 0, i, char;
    if (this.length === 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

// Array Linq like extensions where they make sense:
// http://msdn.microsoft.com/en-us/library/system.linq.enumerable_methods(v=vs.110).aspx

Array.prototype.aggregate = function (func) {
    if (this.length === 0)
        return null;

    func = compileExp(func);
    var aggregateValue = this[0];
    for (var i = 1, len = this.length; i < len; i++)
        aggregateValue = func(aggregateValue, this[i]);
    return aggregateValue;
};

Array.prototype.all = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);

    return results.length === this.count();
};

Array.prototype.any = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);

    return results.length > 0;
};

Array.prototype.average = function () {
    return this.sum() / this.count();
};

//concat is already in ecma...

Array.prototype.contains = function (value) {
    return this.count(
        function (item) {
            return compare(item, value) === 0;
        }) > 0;
};

Array.prototype.count = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);

    return results.length;
};

// Excluding DefaultIfEmpty

Array.prototype.distinct = function () {
    if (this.length < 1)
        return this;

    var sortedResults = this.sort();
    var results = [];
    results.push(sortedResults[0]);
    for (var i = 0, j = 1, len = sortedResults.length; j < len; i++, j++) {
        var prev = sortedResults[i];
        var curr = sortedResults[j];

        if (compare(curr, prev) !== 0)
            results.push(curr);
    }

    return results;
};

Array.prototype.each = function (func) {
    for (var i = 0; i < this.length; i++)
        func.call(Array.prototype.each.caller, this[i]);
};

Array.prototype.elementAt = function (index) {
    if (this.length === 0 || index < 0 || (index - 1) > this.length)
        throw "No Results Found";

    return this[index];
};

Array.prototype.elementAtOrDefault = function (index) {
    if (this.length === 0 || index < 0 || (index - 1) > this.length)
        return null;

    return this[index];
};

// Excluding Empty

Array.prototype.except = function (array) {
    if (this.length === 0 || array.length === 0)
        return this;

    var results = [];
    for (var i = 0, len = this.length; i < len; i++) {
        if (array.contains(this[i]))
            continue;

        results.push(this[i]);
    }

    return results.distinct();
};

Array.prototype.first = function (qry) {
    var result = this.firstOrDefault(qry);

    if (result === null)
        throw "No Results Found";

    return result;
};

Array.prototype.firstOrDefault = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);

    return results.length > 0
        ? results[0]
        : null;
};

Array.prototype.groupBy = function (exp) {
    var compiled = compileExp(exp);
    var keys = this.select(compiled).distinct();
    var results = [];

    for (var i = 0, len = keys.length; i < len; i++)
        results.push({
            key: keys[i],
            value: this.where(function (item) {
                return compiled(item) === keys[i];
            })
        });

    return results;
};

Array.prototype.groupJoin = function (inner, outerKey, innerKey, zipFn) {
    var iKey = compileExp(innerKey);
    var oKey = compileExp(outerKey);
    var results = [];

    for (var i = 0, len = this.length; i < len; i++) {
        var matches = inner.where(function (item) {
            return compare(oKey(this[i]), iKey(item)) === 0;
        });

        results.push(matches);
    }

    return this.zip(results, zipFn);
};

// Same as join from microsoft documentation, however join already exists in ecma and is more of a concat...
Array.prototype.innerJoin = function (inner, outerKey, innerKey, zipFn) {
    var iKey = compileExp(innerKey);
    var oKey = compileExp(outerKey);
    var results = [];

    for (var i = 0; i < this.length; i++) {
        var outerItem = this[i];
        var matches = inner.where(function (item) {
            return compare(oKey(outerItem), iKey(item)) === 0;
        });

        for (var x = 0; x < matches.length; x++)
            results.push(matches[x]);
    }

    return this.zip(results, zipFn);
};

Array.prototype.intersect = function (array) {
    if (this.length === 0 || array.length === 0)
        return [];

    var results = [];
    for (var i = 0; i < array.length; i++)
        for (var j = 0; j < this.length; j++)
            if (compare(this[j], array[i]) === 0)
                results.push(this[j]);

    return results.distinct();
};

Array.prototype.last = function (qry) {
    var result = this.lastOrDefault(qry);

    if (result === null)
        throw "No Results Found";

    return result;
};

Array.prototype.lastOrDefault = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);

    return results.length > 0
        ? results[results.length - 1]
        : null;
};

// Excluding LongCount

Array.prototype.max = function (qry) {
    var results = this.select(qry);
    return Math.max.apply(null, results);
};

Array.prototype.min = function (qry) {
    var results = this.select(qry);
    return Math.min.apply(null, results);
};

// Excluding OfType

Array.prototype.orderBy = function (qry) {
    if (typeof qry === 'undefined')
        return this.sort();

    var compiled = compileExp(qry);

    return this.sort(function (a, b) {
        return compare(compiled(a), compiled(b));
    });
};

Array.prototype.orderByDescending = function (qry) {
    if (typeof qry === 'undefined')
        return this.sort().reverse();

    return this.orderBy(qry).reverse();
};

// Excluding Range

// Excluding Repeat

// Reverse already a part of ecma.

Array.prototype.select = function (qry) {
    if (typeof qry === 'undefined')
        return this;

    var compiled = compileExp(qry);
    var results = [];

    for (var i = 0, len = this.length; i < len; i++)
        results.push(compiled(this[i]));

    return results;
};

Array.prototype.selectMany = function (qry) {
    if (typeof qry === 'undefined')
        return this;

    var results = this.select(qry);
    var array = [];
    for (var i = 0, len = results.length; i < len; i++)
        array = array.union(results[i]);

    return array;
};

Array.prototype.sequenceEqual = function (array) {
    if (typeof array === 'undefined' || array === null)
        return false;

    if (this.length !== array.length)
        return false;

    for (var i = 0, len = this.length; i < len; i++)
        if (compare(this[i], array[i]) !== 0)
            return false;

    return true;
};

Array.prototype.single = function () {
    if (this.length !== 1)
        throw "Sequence does not contain a single element.";

    return this[0];
};

Array.prototype.singleOrDefault = function () {
    if (this.length > 1)
        throw "Sequence does not contain a single element.";

    return this.length === 1
        ? this[0]
        : null;
};

Array.prototype.skip = function (index) {
    return this.slice(index, this.length);
};

Array.prototype.skipWhile = function (qry) {
    var compiled = compileExp(qry);
    var results = [];

    for (var i = 0, len = this.length; i < len; i++)
        if (compiled(this[i]) !== true)
            results.push(this[i]);

    return results;
};

Array.prototype.sum = function () {
    if (this.length === 0)
        return 0;

    var sum = 0;
    for (var i = 0, len = this.length; i < len; i++)
        sum += this[i];
    return sum;
};

Array.prototype.take = function (count) {
    return this.slice(0, count);
};

Array.prototype.takeWhile = function (qry) {
    var compiled = compileExp(qry);
    var results = [];

    for (var i = 0, len = this.length; i < len; i++) {
        var item = this[i];
        if (compiled(item) !== true)
            return results;

        results.push(item);
    }

    return results;
};

// Excluding ThenBy
// Excluding ThenByDescending
// Excluding ToArray ... lol
// Excluding ToDictionary
// Excluding ToList
// Excluding ToLookup

Array.prototype.union = function (array) {
    if (typeof array === 'undefined' || array === null)
        return this;

    return this.concat(array).distinct();
};

Array.prototype.where = function (qry) {
    var compiled = compileExp(qry);
    var results = [];

    for (var i = 0, len = this.length; i < len; i++)
        if (compiled(this[i]) === true)
            results.push(this[i]);

    return results;
};

Array.prototype.zip = function (second, zipFn) {
    var results = [];

    if (typeof zipFn !== 'function')
        zipFn = compileExp(zipFn);

    for (var i = 0, len = this.length; i < len; i++)
        if (second.length > i)
            results.push(zipFn(this[i], second[i]));

    return results;
};

// Comparison and compilation expressions

compileExp = function (exp) {
    if (typeof exp === 'undefined')
        throw "Expression is invalid.";

    if (typeof exp === 'function')
        return exp;

    var parts = exp.split('=>');
    var arg = parts.length > 0 ? parts[0].trim().replace(/\(|\)/g, '') : null;
    var func = parts.length > 1 ? parts[1].trim() : null;

    if (arg === null || func === null)
        throw "Expression is invalid.";

    return new Function(arg, 'return (' + func + ');');
};

compare = function (obj1, obj2) {
    if (typeof obj1 === 'undefined' || typeof obj2 === 'undefined')
        return typeof obj1 === 'undefined' ? -1 : (typeof obj2 === 'undefined' ? 1 : 0);

    if (typeof obj1 !== typeof obj2)
        throw "Both objects must be of the same type";

    if (obj1.compare)
        return obj1.compare(obj2);

    if (typeof obj1 === 'string') {
        var hash1 = obj1.hashCode();
        var hash2 = obj2.hashCode();

        return hash1 < hash2 ? -1 : (hash1 > hash2 ? 1 : 0);
    }

    if (typeof obj1 === 'number')
        return obj1 < obj2 ? -1 : (obj1 > obj2 ? 1 : 0);

    if (typeof obj1 === 'boolean')
        return obj1 === obj2 ? 0 : (obj1 ? 1 : -1);

    if (typeof obj1 === 'function') {
        var val1 = obj1();
        var val2 = obj2();

        return compare(val1, val2);
    }

    if (typeof obj1 === 'object') {
        var result = 0;
        for (key in obj1) {
            var temp = compare(obj1[key], obj2[key]);
            if (temp === -1) return temp;
            result = Math.max(result, temp);
        }
        return result;
    }

    throw "Unable to compare objects";
};
