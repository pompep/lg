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
     * @type {Object.<string, !pp.lg.Identificable>} symbol.id => symbol
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
    if (!this.closed_) {
        if (symbol.getId() in this.set_) {
            return false;
        } else {
            this.set_[symbol.getId()] = symbol;
            return true;
        }
    } else {
        goog.asserts.fail('Set is already closed against add operation');
    }
};

pp.lg.Set.prototype.asArray = function() {
    return goog.object.getValues(this.set_);
};


/**
 * @param id
 * @returns {pp.lg.Identificable}
 */
pp.lg.Set.prototype.getById = function(id) {
    return goog.object.get(this.set_, id, null);
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
    var res = new  pp.lg.Set();

    for (var aId in this.set_) {
        var a = this.getById(aId);

        for (var bId in setB) {
            var b = this.getById(bId);

            res.push(a.concat(b));
        }
    }

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

    return ret;
};

/**
 * {w.first(k) | w in this.concat(setB)}
 * @param (pp.lg.Set) setB
 * @param (int) k
 */
pp.lg.Set.prototype.kConcat = function(setB, k) {
    var concat = this.concat(setB),
        concats = concat.asArray(),
        ret = new pp.lg.Set()
    ;

    for (var i = 0, len = concats.length; i < len; i++) {
        var s = concats[i];
        ret.add(s.first(k));
    }

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