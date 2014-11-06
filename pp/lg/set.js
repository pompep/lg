/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */

goog.provide('pp.lg.Set');

goog.require('goog.object');

/**
 * @constructor
 */
pp.lg.Set = function() {
    /**
     * @type {Object.<string, pp.lg.Identificable>} symbol.id => symbol
     * @private
     */
    this.set_ = {};


    /**
     * @type {boolean} true = no other element can be added
     * @private
     */
    this.closed_  = false;
};

/**
 *
 * @param {pp.lg.Identificable} symbol
 * @return {boolean} was symbol inserted firstime?
 */
pp.lg.Set.prototype.add = function(symbol) {
    var ret = false;

    if (!this.closed_) {
        var id = goog.isNull(symbol) ? '' : symbol.getId();

        if (!(id in this.set_)) {
            this.set_[id] = symbol;
            ret = true;
        }
    } else {
        goog.asserts.fail('Set is already closed against add operation');
    }

    return ret;
};

/**
 * @return {number}
 */
pp.lg.Set.prototype.size = function() {
    return goog.object.getCount(this.set_);
};

/**
 *
 * @return {!Array.<pp.lg.Identificable>}
 */
pp.lg.Set.prototype.asArray = function() {
    return goog.object.getValues(this.set_);
};


/**
 * @param id
 * @returns {pp.lg.Identificable}
 */
pp.lg.Set.prototype.getById = function(id) {
    return /** @type {pp.lg.Identificable}*/ (goog.object.get(this.set_, id, null));
};


pp.lg.Set.prototype.close = function() {
    this.closed_ = true;
};

/**
 * @return {boolean}
 */
pp.lg.Set.prototype.isClosed = function() {
    return this.closed_;
};

/**
 * Language concat
 * @param {pp.lg.Set} setB
 * @return {pp.lg.Set}
 */
pp.lg.Set.prototype.concat = function(setB) {
    var res = new pp.lg.Set(),
        aArr = this.asArray(),
        bArr = setB.asArray()
    ;

    for (var i = 0, len = aArr.length; i < len; i++) {
        var a = aArr[i];

        for (var j = 0, ll = bArr.length; j < ll; j++) {
            var b = bArr[j],
                concatStr = goog.isNull(a) ? b : a.concat(b)
            ;

            res.add(concatStr);
        }
    }
//console.log(this.toString() + ' concat ' + setB.toString()+ ' = '+ res.toString());
    return res;
};

/**
 *
 * @param {pp.lg.Set} setB
 * @return {pp.lg.Set}
 */
pp.lg.Set.prototype.union = function(setB) {
    var ret = this.clone(),
        b = setB.asArray()
    ;

    for (var i = 0, len = b.length; i < len; i++) {
        ret.add(b[i]);
    }
//    console.log(this.toString() + ' U '+ setB.toString()+ ' = '+ ret.toString());
    return ret;
};

/**
 * {w.first(k) | w in this.concat(setB)}
 * @param {pp.lg.Set} setB
 * @param {number} k
 * @return {pp.lg.Set}
 */
pp.lg.Set.prototype.kConcat = function(setB, k) {
    var concat = this.concat(setB),
        concats = concat.asArray(),
        ret = new pp.lg.Set()
    ;

    for (var i = 0, len = concats.length; i < len; i++) {
        var s = concats[i];
        ret.add(goog.isNull(s) ? s : s.first(k));
    }
//    console.log(this.toString() + ' concat_'+k +' ' + setB.toString()+ ' = '+ ret.toString());
    return ret;
};

/**
 * Returns clone in open to add
 * @return {pp.lg.Set}
 */
pp.lg.Set.prototype.clone = function() {
    var ret = new pp.lg.Set();

    for (var sId in this.set_) {
        ret.add(this.set_[sId]);
    }

    return ret;
};

/**
 *
 * @param {pp.lg.Set} setB
 * @return {boolean}
 */
pp.lg.Set.prototype.equal = function(setB) {
    var elements = this.asArray(),
        ret = this.size() === setB.size()
    ;

    for (var i = 0, len = elements.length; ret && (i < len); i++) {
        ret = setB.contains(elements[i]);
    }

    return ret;
};

/**
 *
 * @param {pp.lg.Identificable} element
 * @return {boolean}
 */
pp.lg.Set.prototype.contains = function(element) {
    var key = goog.isNull(element) ? '' : element.getId(); // key of empty string
    return goog.object.containsKey(this.set_, key);
};

pp.lg.Set.prototype.toString = function() {
    var ret = '{',
        i = 0
    ;

    for (var id in this.set_) {
        ret += (i++ > 0 ? ',' : '') + '\'' + id + '\'';
    }

    ret += '}';

    return ret;
};