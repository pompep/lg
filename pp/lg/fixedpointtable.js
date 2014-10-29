/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview
 */


goog.provide('pp.lg.FixedPointTable');
goog.provide('pp.lg.Equation');

/**
 *
 * @param {pp.lg.Grammar} G
 * @param {pp.lg.String} alpha
 * @param {number} k
 * @constructor
 */
pp.lg.FixedPointTable = function(G, alpha, k) {
    /**
     * Holds equations form solved nonterminals
     * @type {Object.<string, pp.lg.Equation>}
     * @private
     */
    this.equations_ = {};

    /**
     * Map of actualy parsing nonterminals
     * @type {Object.<string, boolean>}
     * @private
     */
    this.parsing_ = {};

    this.parse(G, alpha, k);

    this.iterationCompute();
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @return {pp.lg.Set}
 */
pp.lg.FixedPointTable.prototype.get = function(nonTerm) {
    return this.equations_[nonTerm.getId()].getResult();
};

/**
 *
 * @return {boolean} has this iteration step some effect? false => stop computation
 * @private
 */
pp.lg.FixedPointTable.prototype.iterationStep = function() {
    var ret = false;

    for (var id in this.equations_) {
        var e = this.equations_[id],
            changed = e.compute()
        ;

        ret = ret || changed;
        console.log(id, 'compute', e.getResult().toString(), changed);
    }

    return ret;
};

/**
 * @private
 */
pp.lg.FixedPointTable.prototype.iterationCompute = function() {
    while(this.iterationStep()){};
};

/**
 * @param {pp.lg.Grammar} G
 * @param {pp.lg.String} alpha
 * @param {number} k
 */
pp.lg.FixedPointTable.prototype.parse = function(G, alpha, k) {
    for (var i = 0, len = alpha.length(); i < len; i++) {
        var s = alpha.getSymbolAt(i);

        if (!s.isTerminal()) {
            this.addEquation(s, this.parseNonTermEq(s, G, k));
        }
    }
};

/**
 *
 * @param {pp.lg.Symbol} s
 * @param {pp.lg.Grammar} G
 * @param {number} k
 * @return {function(): pp.lg.Set}
 * @private
 */
pp.lg.FixedPointTable.prototype.parseNonTermEq = function(s, G, k) {
    this.parsing_[s.getId()] = true;

    var rules = G.getRulesWithLeftEqual(s),
        ruleFcns = []
    ;

    for (var j = 0, ll = rules.length; j < ll; j++) {
        var rightSide = rules[j].getRight(),
            symbolFcns = []
        ;

        for (var m = 0, lll = rightSide.length(); m < lll; m++) {
            var rSymbol = rightSide.getSymbolAt(m);

            if (rSymbol.isTerminal()) {
                symbolFcns.push(goog.bind(function(terminal) {
                    var ret = new pp.lg.Set();
                    ret.add(terminal);
                    return ret;
                }, this, rSymbol));
            } else {
                if (!this.parsing(rSymbol)) {
                    this.addEquation(rSymbol, this.parseNonTermEq(rSymbol, G, k));
                }

                symbolFcns.push(goog.bind(function(nonTerm) {
                    return this.get(nonTerm);
                }, this, rSymbol));
            }
        }

        ruleFcns.push(goog.bind(function(rsequas) {
            var kConcat = rsequas[0]();

            for (var m1 = 1, l1 = rsequas.length; m1 < l1; m1++) {
                kConcat = kConcat.kConcat(rsequas[m1](), k);
            }

            return kConcat;
        }, this, symbolFcns));
    }

    return goog.bind(function(ruleUnions) {
        var ret = new pp.lg.Set();

        for (var n = 0, rl = ruleUnions.length; n < rl; n++) {
            ret = ret.union(ruleUnions[n]());
        }

        return ret;
    }, this, ruleFcns);
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @return {boolean}
 */
pp.lg.FixedPointTable.prototype.parsing = function(nonTerm) {
    return goog.object.containsKey(this.parsing_, nonTerm.getId());
};

/**
 *
 * @param {pp.lg.Symbol} nonTerm
 * @param {function(): pp.lg.Set} equation
 */
pp.lg.FixedPointTable.prototype.addEquation = function(nonTerm, equation) {
    this.equations_[nonTerm.getId()] = new pp.lg.Equation(equation);
};

/**
 * Equation for nonterminal
 * @constructor
 * @param {function(): pp.lg.Set} equation
 */
pp.lg.Equation = function(equation) {
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
pp.lg.Equation.prototype.getResult = function() {
    return this.tmpRes_;
};

/**
 *
 * @return {boolean}
 */
pp.lg.Equation.prototype.compute = function() {
    var res = this.equation_(),
        changed = !res.equal(this.tmpRes_)
    ;

    if (changed) {
        this.tmpRes_ = res;
    }

    return changed;
};
