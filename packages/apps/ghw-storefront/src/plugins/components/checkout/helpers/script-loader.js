export const loadScript = (src, id) => {
  if (!document) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.src = src;
    if (id) {
      script.id = id;
    }
    script.onerror = reject;
    script.onload = resolve;
    script.async = false;
    document.body.appendChild(script);
  });
};
