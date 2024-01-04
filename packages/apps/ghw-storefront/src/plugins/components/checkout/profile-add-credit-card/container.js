import React from 'react';
import {connect} from '@oracle-cx-commerce/react-components/provider';
import HostedFieldsProvider from './providers/hostedFieldsProvider';
import Component from './component';
import {getPageData} from './selectors';

const Container = props => {
  return (
    <HostedFieldsProvider>
      <Component {...props} />
    </HostedFieldsProvider>
  );
};

export default connect(getPageData)(Container);
