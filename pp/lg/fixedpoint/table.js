/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview Abstract class for fixedpoint iteration process, computed values are cached (table) for simply access
 */

goog.provide('pp.lg.fp.Table');

goog.require('pp.lg.fp.Equation');

/**
 *
 * @param {pp.lg.Grammar} G
 * @param {number} k
 * @constructor
 */
pp.lg.fp.Table = function(G, k) {
    /**
     * @type {pp.lg.Grammar}
     */
    this.G = G;

    /**
     * @type {number}
     */
    this.k = k;

    /**
     * Holds equations form solved nonterminals
     * @type {Object.<string, pp.lg.fp.Equation>}
     * @private
     */
    this.equations_ = {};

    /**
     * Map of actualy parsing nonterminals
     * @type {Object.<string, boolean>}
     * @private
     */
    this.parsing_ = {};

    this.buildEquations();
    this.iterationCompute();
};

/**
 * Getter for computed values
 * @param {pp.lg.Symbol} nonTerm
 * @return {pp.lg.Set}
 */
pp.lg.fp.Table.prototype.get = function(nonTerm) {
    return this.equations_[nonTerm.getId()].getResult();
};

/**
 * @protected
 */
pp.lg.fp.Table.prototype.buildEquations = goog.abstractMethod;

/**
 * @protected
 * @returns {string}
 */
pp.lg.fp.Table.prototype.getDebugTitle = goog.abstractMethod;

/**
 *
 * @return {boolean} has this iteration step some effect? false => stop computation
 * @protected
 */
pp.lg.fp.Table.prototype.iterationStep = function() {
    var ret = false;

    for (var id in this.equations_) {
        var e = this.equations_[id],
            changed = e.compute()
        ;

        ret = ret || changed;
//        console.log(this.getDebugTitle(), id, 'compute', e.getResult().toString(), changed);
    }

    return ret;
}

/**
 * @private
 */
pp.lg.fp.Table.prototype.iterationCompute = function() {
    while(this.iterationStep()){};
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @return {boolean}
 * @protected
 */
pp.lg.fp.Table.prototype.parsing = function(nonTerm) {
    return goog.object.containsKey(this.parsing_, nonTerm.getId());
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @protected
 */
pp.lg.fp.Table.prototype.addToParsing = function(nonTerm) {
    goog.object.set(this.parsing_, nonTerm.getId(), true);
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @param {function(): pp.lg.Set} equation
 * @protected
 */
pp.lg.fp.Table.prototype.addEquation = function(nonTerm, equation) {
    this.equations_[nonTerm.getId()] = new pp.lg.fp.Equation(equation);
};
