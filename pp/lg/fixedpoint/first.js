/**
 * @author Patrik Pompe <325292@mail.muni.cz>
 * @fileoverview Computes and holds values of nonterminals required for coumputation First-k set of given Alpha
 */

goog.provide('pp.lg.fp.First');

goog.require('pp.lg.fp.Table');

/**
 * @param {pp.lg.Grammar} G
 * @param {number} k
 * @param {pp.lg.String} alpha
 * @constructor
 * @extends pp.lg.fp.Table
 */
pp.lg.fp.First = function(G, k, alpha) {
    /**
     * @type {pp.lg.String}
     * @private
     */
    this.alpha_ = alpha;

    goog.base(this, G, k);
};
goog.inherits(pp.lg.fp.First, pp.lg.fp.Table);

/**
 * @inheritDoc
 */
pp.lg.fp.First.prototype.getDebugTitle = function() {
    return 'First';
};

/**
 * @protected
 */
pp.lg.fp.First.prototype.buildEquations = function() {
    for (var i = 0, len = this.alpha_.length(); i < len; i++) {
        var s = this.alpha_.getSymbolAt(i);

        if (!s.isTerminal()) {
            this.addEquation(s, this.parseNonTermEq(s));
        }
    }
};

/**
 *
 * @param {pp.lg.Symbol} s
 * @return {function(): pp.lg.Set}
 * @private
 */
pp.lg.fp.First.prototype.parseNonTermEq = function(s) {
    this.addToParsing(s);

    var rules = this.G.getRulesWithLeftEqual(s),
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
                    this.addEquation(rSymbol, this.parseNonTermEq(rSymbol));
                }

                symbolFcns.push(goog.bind(function(nonTerm) {
                    return this.get(nonTerm);
                }, this, rSymbol));
            }
        }

        ruleFcns.push(goog.bind(function(rsequas) {
            var ret;
            if (rsequas.length > 0) {
                var kConcat = rsequas[0]();

                for (var m1 = 1, l1 = rsequas.length; m1 < l1; m1++) {
                    kConcat = kConcat.kConcat(rsequas[m1](), this.k);
                }

                ret = kConcat;
            } else {
                ret = new pp.lg.Set();
                ret.add(null);
            }

            return ret;
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