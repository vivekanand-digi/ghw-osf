/*
 ** Copyright (c) 2020 Oracle and/or its affiliates.
 */

import React, {useState, useEffect, useRef} from 'react';

let autoComplete;

const loadScript = (url, callback) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.addEventListener('readystatechange', function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    });
  } else {
    script.addEventListener('load', () => callback());
  }

  script.src = url;
  document.querySelectorAll('head')[0].appendChild(script);
};
const options = {
  fields: ['formatted_address', 'address_components', 'geometry', 'name'],
  strictBounds: false,
  componentRestrictions: {country: ['us', 'ca']},
  types: ['address']
};
function handleScriptLoad(updateQuery, autoCompleteRef, placeSelectHanlder) {
  autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, options);
  autoComplete.setFields(['address_components', 'formatted_address']);
  autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery, placeSelectHanlder));
}

async function handlePlaceSelect(updateQuery, placeSelectHanlder) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  placeSelectHanlder(addressObject);
}
const GoogleTypeahead = props => {
  const {placeSelectHanlder} = props;
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAsvAKrFEALM-j9ekSyjarOL69mlI7-jxI&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, placeSelectHanlder)
    );
  }, []);

  return (
    <div className="typeahead-field">
      <input
        ref={autoCompleteRef}
        onChange={event => setQuery(event.target.value)}
        value={query}
        className="form-field__input"
        placeholder="Search your new address "
      />
    </div>
  );
};

export default GoogleTypeahead;
