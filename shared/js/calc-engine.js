// calc-engine.js — 6 economic statistics calculator functions
var CalcEngine = {

  // 1. Laspeyres Price Index: Lp = Σ(p1 × q0) / Σ(p0 × q0) × 100
  laspeyresPrice: function(p1Array, p0Array, q0Array) {
    var num = 0, den = 0;
    for (var i = 0; i < p1Array.length; i++) {
      num += p1Array[i] * q0Array[i];
      den += p0Array[i] * q0Array[i];
    }
    return den === 0 ? null : { index: (num / den * 100), numerator: num, denominator: den };
  },

  // 2. Paasche Price Index: Pp = Σ(p1 × q1) / Σ(p0 × q1) × 100
  paaschePrice: function(p1Array, p0Array, q1Array) {
    var num = 0, den = 0;
    for (var i = 0; i < p1Array.length; i++) {
      num += p1Array[i] * q1Array[i];
      den += p0Array[i] * q1Array[i];
    }
    return den === 0 ? null : { index: (num / den * 100), numerator: num, denominator: den };
  },

  // 3. GDP Deflator: Nominal GDP / Real GDP × 100
  gdpDeflator: function(nominalGDP, realGDP) {
    if (realGDP === 0) return null;
    return { index: nominalGDP / realGDP * 100, nominal: nominalGDP, real: realGDP };
  },

  // 4. Nominal ↔ Real GDP conversion
  nominalToReal: function(nominalGDP, deflator) {
    if (deflator === 0) return null;
    return { realGDP: nominalGDP / deflator * 100, nominalGDP: nominalGDP, deflator: deflator };
  },
  realToNominal: function(realGDP, deflator) {
    return { nominalGDP: realGDP * deflator / 100, realGDP: realGDP, deflator: deflator };
  },

  // 5. Growth rate calculator
  growthRate: function(current, previous) {
    if (previous === 0) return null;
    return { rate: (current - previous) / previous * 100, current: current, previous: previous };
  },
  cagr: function(finalValue, initialValue, years) {
    if (initialValue <= 0 || years <= 0) return null;
    return { rate: (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100 };
  },

  // 6. Purchasing Power Parity (PPP) conversion
  pppConvert: function(amount, pppRate) {
    if (pppRate === 0) return null;
    return { converted: amount / pppRate, original: amount, rate: pppRate };
  }
};
