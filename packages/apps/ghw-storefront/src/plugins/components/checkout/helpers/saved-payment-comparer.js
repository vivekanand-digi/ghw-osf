export const compareSavedPayments = (p1, p2) => {
  if (p1.default) {
    return -1;
  }
  if (p2.default) {
    return 1;
  }
  if (p1.expirationYear && p1.expirationMonth && p2.expirationYear && p2.expirationMonth) {
    const p1exp = `${p1.expirationYear}-${p1.expirationMonth}`;
    const p2exp = `${p2.expirationYear}-${p2.expirationMonth}`;
    if (p1exp > p2exp) {
      return -1;
    }
    if (p1exp < p2exp) {
      return 1;
    }
  }
  return 1;
};
