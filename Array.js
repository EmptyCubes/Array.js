﻿/************************
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
<<<<<<< HEAD
    var query = qry.split('=>');
    var arg = query.length > 0 ? query[0].trim() : null;
    var func = query.length > 1 ? query[1].trim() : null;

    if (arg === null || func === null) {
        throw "Invalid arrow function";
    }

    var compiled = new Function(arg, 'return (' + func + ') === true;');

=======
	var compiled = window.compileExp(qry);
 
>>>>>>> upstream/master
    for (var i = 0, len = this.length; i < len; i++) {
        var item = this[i];
        if (compiled(item) === true) {
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
<<<<<<< HEAD

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
=======
 
	var compiled = window.compileExp(qry);
	
    return this.sort(function(a,b) {
		return window.compare(compiled(a), compiled(b));
	});
>>>>>>> upstream/master
};

Array.prototype.orderByDesc = function (qry) {
    if (typeof qry === 'undefined') {
        return this.sort().reverse();
    }

    return this.orderBy(qry).reverse();
};

Array.prototype.take = function (count) {
	return this.slice(0, count);
};

Array.prototype.skip = function (index) {
    return this.slice(index, this.length);
};

Array.prototype.select = function (qry) {
    if (typeof qry === 'undefined') {
        return this;
    }

	var compiled = window.compileExp(qry);
    var results = [];
	
    for (var i = 0, len = this.length; i < len; i++) {
        results.push(compiled(this[i]));
    }

    return results;
};

Array.prototype.selectMany = function (qry) {
    if (typeof qry === 'undefined') {
        return this;
    }

    var results = this.select(qry);
    var array = [];
    for (var i = 0; i < results.length; i++) {
        array = array.union(results[i]);
    }

    return array;
};

Array.prototype.union = function (array) {
    if (typeof array === 'undefined' || array == null) {
        return this;
    }

    var arrayClone = array.slice();
    arrayClone.splice(0, 0, this.length, 0);
    
    var clone = this.slice();
    clone.splice.apply(clone, arrayClone);
    
    return clone;
};

Array.prototype.reverse = function () {
    var results = [];
    for (var i = this.length - 1; i >= 0; i--) {
        results.push(this[i]);
    }
    
    return results;
};

Array.prototype.max = function (qry) {
    var results = this.select(qry);
    return Math.max.apply(null, results);
};

Array.prototype.min = function (qry) {
    var results = this.select(qry);
    return Math.min.apply(null, results);
};

Array.prototype.sum = function () {
    if (this.length == 0)
        return 0;

    var sum = 0;
    for (var i = 0; i < this.length; i++)
        sum += this[i];
    return sum;
};

Array.prototype.average = function () {
    return this.sum() / this.count();
};

Array.prototype.distinct = function () {
    if (this.length < 1)
        return this;

    var sortedResults = this.sort();
    var results = [];
    results.push(sortedResults[0]);
    for (var i = 0, j = 1; j < sortedResults.length; i++, j++) {
        var prev = sortedResults[i];
        var curr = sortedResults[j];
        
        if (compare(curr, prev) !== 0)
            results.push(curr);
    }

    return results;
};

<<<<<<< HEAD
Array.prototype.selectMany = function (qry) {
    if (typeof qry === 'undefined') {
        return this;
    }

    var results = this.select(qry);
    var array = [];
    for (var i = 0; i < results.length; i++) {
        array = array.union(results[i]);
    }

    return array;
};

Array.prototype.union = function (array) {
    if (typeof array === 'undefined' || array == null) {
        return this;
    }

    var arrayClone = array.slice();
    arrayClone.splice(0, 0, this.length, 0);
    
    var clone = this.slice();
    clone.splice.apply(clone, arrayClone);
    
    return clone;
};

Array.prototype.reverse = function () {
    var results = [];
    for (var i = this.length - 1; i >= 0; i--) {
        results.push(this[i]);
    }
    
    return results;
};

Array.prototype.max = function (qry) {
    var results = this.select(qry);
    return Math.max.apply(null, results);
};

Array.prototype.min = function (qry) {
    var results = this.select(qry);
    return Math.min.apply(null, results);
};

Array.prototype.sum = function () {
    if (this.length == 0)
        return 0;

    var sum = 0;
    for (var i = 0; i < this.length; i++)
        sum += this[i];
    return sum;
};

Array.prototype.average = function () {
    return this.sum() / this.count();
};

Array.prototype.distinct = function () {
    if (this.length < 1)
        return this;

    var sortedResults = this.sort();
    var results = [];
    results.push(sortedResults[0]);
    for (var i = 0, j = 1; j < sortedResults.length; i++, j++) {
        var prev = sortedResults[i];
        var curr = sortedResults[j];
        
        if (!(equals(curr, prev)))
            results.push(curr);
    }

    return results;
};

=======
>>>>>>> upstream/master
Array.prototype.innerJoin = function (qry) {
    return this;
};

Array.prototype.groupJoin = function (qry) {
    return this;
};

<<<<<<< HEAD
function compare(obj, compareTo) {
    if (!compareTo || obj.length != compareTo.length) {
        return false;
    }
    for (var i = 0; i < obj.length; ++i) {
        if (obj[i] !== compareTo[i]) {
            return false;
        }
    }
    return true;
};



=======
window.compileExp = function(exp) {
	if (typeof exp === 'undefined') {
        throw "Expression is invalid.";
    }

	var parts = exp.split('=>');
    var arg = parts.length > 0 ? parts[0].trim() : null;
    var func = parts.length > 1 ? parts[1].trim() : null;
 
    if (arg === null || func === null) {
        throw "Expression is invalid.";
    }
 
    return new Function(arg, 'return (' + func + ');');
};

window.compare = function(obj1, obj2) {
	if (typeof obj1 === 'undefined' || typeof obj2 === 'undefined') {
		return typeof obj1 === 'undefined' ? -1 : (typeof obj2 === 'undefined' ? 1 : 0);
	}

	if (typeof obj1 !== typeof obj2) {
		throw "Both objects must be of the same type";
	}

	if (obj1.compare) {
		return obj1.compare(obj2);
	}
	
	if (typeof obj1 === 'string') {
		var hash1 = obj1.hashCode();
		var hash2 = obj2.hashCode();
		
		return hash1 < hash2 ? -1 : (hash1 > hash2 ? 1 : 0);
	}
	
	if (typeof obj1 === 'number') {
		return obj1 < obj2 ? -1 : (obj1 > obj2 ? 1 : 0);
	}
	
	if (typeof obj1 === 'boolean') {
		return obj1 === obj2 ? 0 : (obj1 ? 1 : -1);
	}
	
	if (typeof obj1 === 'function') {
		var val1 = obj1();
		var val2 = obj2();
		
		return window.compare(val1, val2);
	}
	
	if (typeof obj1 === 'object') {
		var result = 0;
		for(key in obj1) {
			var temp = window.compare(obj1[key], obj2[key]);
			if (temp == -1) return temp;
			result = Math.max(result, temp);
		}
		return result;
	}
	
	throw "Unable to compare objects";
};
>>>>>>> upstream/master
