/* eslint-disable no-undef */
export const fetchWithTimeout = async (resource, options = {}) => {
  const {timeout = 8000} = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
};

const trimObjectStringValues = inObj => {
  if (inObj) {
    const outObj = {...inObj};
    Object.keys(outObj).forEach(prop => {
      outObj[prop] = typeof inObj[prop] === 'string' ? inObj[prop].trim() : inObj[prop];
    });

    return outObj;
  }

  return null;
};

export const processJDEAddress = inAddress => {
  return trimObjectStringValues(inAddress);
};

export const processJDECardDetails = inCardDetails => {
  return trimObjectStringValues(inCardDetails);
};
