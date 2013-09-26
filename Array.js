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
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
 
Array.prototype.where = function (qry) {
    var results = [];
    var query = qry.split('=>');
    var arg = query.length > 0 ? query[0].trim() : null;
    var func = query.length > 1 ? query[1].trim() : null;
 
    if (arg === null || func === null) {
        throw "Invalid arrow function";
    }
 
    var compiled = new Function(arg, 'return (' + func + ') === true;');
 
    for (var i = 0, len = this.length; i < len; i++) {
        var item = this[i];
        if (compiled(item)) {
            results.push(item);
        }
    }
 
    return results;
};
 
Array.prototype.firstOrDefault = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);
 
    return results.length > 0
        ? results[0]
        : null;
};
 
Array.prototype.first = function (qry) {
    var result = this.firstOrDefault(qry);
 
    if (result === null) {
        throw "No Results Found";
    }
 
    return result;
};
 
Array.prototype.count = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);
 
    return results.length;
};
 
Array.prototype.any = function (qry) {
    var results = typeof qry === 'undefined'
        ? this
        : this.where(qry);
 
    return results.length > 0;
};
 
Array.prototype.orderBy = function (qry) {
    if (typeof qry === 'undefined') {
        return this.sort();
    }
 
    var query = qry.split('=>');
    var arg = query.length > 0 ? query[0].trim() : null;
    var func = query.length > 1 ? query[1].trim() : null;
 
    if (arg === null || func === null) {
        throw "Invalid arrow function";
    }
 
    var compiled = new Function(arg, 'return (' + func + ');');
    var sortFn = function (a, b) {
        var valA = compiled(a);
        var valB = compiled(b);
 
        if (typeof valA === 'string') {
            valA = valA.hashCode();
        }
 
        if (typeof valB === 'string') {
            valB = valB.hashCode();
        }
 
        return valA < valB ? -1 : (valA > valB ? 1 : 0);
    };
 
    return this.sort(sortFn);
};
 
Array.prototype.orderByDesc = function (qry) {
    if (typeof qry === 'undefined') {
        return this.sort().reverse();
    }
 
    return this.orderBy(qry).reverse();
};
 
Array.prototype.take = function (count) {
    var results = [];
    for (var i = 0, len = this.length; i < len && i < count; i++) {
        results.push(this[i]);
    }
    return results;
};
 
Array.prototype.skip = function (index) {
    return this.slice(index, this.length);
};