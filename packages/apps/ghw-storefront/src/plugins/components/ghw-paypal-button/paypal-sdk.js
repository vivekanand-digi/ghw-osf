const extractFundingSources = fundlingList => {
  const list = fundlingList.split(',');
  const enable = ['paypal'].filter(i => list.includes(i)).join(',');
  const disable = ['card', 'credit', 'bancontact', 'venmo', 'paylater'].filter(i => !list.includes(i)).join(',');

  return {enable, disable};
};

export const payPalSdk = ({widgetId, clientId, intent, currencyCode, vault, commit, enableFunding}) => {
  return new Promise(resolve => {
    if (!clientId || !currencyCode) {
      return undefined;
    }
    const widgetDom = document.querySelector(`#${widgetId}`);
    const parentNodeDom = widgetDom.parentNode;
    widgetDom.remove();
    const newWidgetDom = document.createElement('div');
    newWidgetDom.id = widgetId;
    parentNodeDom.append(newWidgetDom);
    const ppScript = document.querySelector('#paypal-sdk');
    if (ppScript) {
      ppScript.remove();
    }
    const fundingSources = extractFundingSources(enableFunding);
    const params = [
      {k: 'vault', v: vault},
      {k: 'commit', v: commit},
      {k: 'client-id', v: clientId},
      {k: 'currency', v: currencyCode},
      {k: 'components', v: 'buttons,messages'},
      {k: 'enable-funding', v: fundingSources.enable},
      {k: 'disable-funding', v: fundingSources.disable},
      {k: 'intent', v: intent}
    ]
      .map(p => `${p.k}=${p.v}`)
      .join('&');
    const paypalScript = document.createElement('script');
    paypalScript.id = 'paypal-sdk';
    paypalScript.src = `https://www.paypal.com/sdk/js?${params}`;
    paypalScript.async = false;
    document.body.append(paypalScript);
    document.querySelector(`#${paypalScript.id}`).addEventListener('load', () => {
      resolve(window.paypal);
    });
  });
};
