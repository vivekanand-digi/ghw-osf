import React from 'react';
import Styled from '@oracle-cx-commerce/react-components/styled';
import css from './styles.css';
import GHWProfileLeftNav from '../ghw-profile-left-navigation';
import GHWProfileDetailsForm from '../ghw-profile-details-form';
import GhwProfileUpdatePassword from '../ghw-profile-update-password';
import GHWProfileAddressBook from '../ghw-profile-address-book/component';
import GhwProfileAddressForm from '../ghw-profile-address-form';
import GHWProfileSavedCards from '../ghw-profile-saved-cards';
import { t } from "@oracle-cx-commerce/utils/generic";

const GHWProfileContainer = props => {
  const {route} = props;

  return (
    <Styled id="GHWProfileContainer" css={css}>
      <div className="profile-container tab-cnr">
        <div className="col-xs-12 col-lg-3">
          <GHWProfileLeftNav {...props} />
        </div>
        <div className="col-xs-12 col-lg-9">
          {route === '/profile' && <GHWProfileDetailsForm {...props} />}
          {route === '/profile-saved-cards' && <GHWProfileSavedCards {...props} />}
          {route === '/update-password' && <GhwProfileUpdatePassword {...props} />}
          {route === '/address-book' && <GHWProfileAddressBook {...props} />}
          {(route === '/add-profile-address' || route === '/edit-profile-address') && (
            <GhwProfileAddressForm {...props} />
          )}
        </div>
      </div>
    </Styled>
  );
};

export default GHWProfileContainer;
