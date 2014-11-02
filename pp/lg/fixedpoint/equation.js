goog.provide('pp.lg.fp.Equation');

/**
 * Equation for nonterminal
 * @constructor
 * @param {function(): pp.lg.Set} equation
 */
pp.lg.fp.Equation = function(equation) {
    /**
     * @type {function(): pp.lg.Set}
     * @private
     */
    this.equation_ = equation;

    /**
     * @type {pp.lg.Set}
     * @private
     */
    this.tmpRes_ = new pp.lg.Set();
};

/**
 * @return {pp.lg.Set}
 */
pp.lg.fp.Equation.prototype.getResult = function() {
    return this.tmpRes_;
};

/**
 *
 * @return {boolean}
 */
pp.lg.fp.Equation.prototype.compute = function() {
    var res = this.equation_(),
        changed = !res.equal(this.tmpRes_)
    ;

    if (changed) {
        this.tmpRes_ = res;
    }

    return changed;
};
