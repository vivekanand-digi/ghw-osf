import React from 'react';

const amountFormat = n => (n || 0).toFixed(2);

const PaylaterMessaging = ({
  amount,
  messagingLayout,
  messagingLogoType,
  messagingLogoPosition,
  messagingTextColor,
  messagingTextSize,
  messagingTextAlign,
  messagingColor,
  messagingRatio,
  messagingPlacement
}) => {
  return (
    <div
      data-pp-message
      data-pp-amount={amountFormat(amount)}
      data-pp-style-layout={messagingLayout}
      data-pp-style-logo-type={messagingLogoType}
      data-pp-style-logo-position={messagingLogoPosition}
      data-pp-style-text-color={messagingTextColor}
      data-pp-style-text-size={messagingTextSize}
      data-pp-style-text-align={messagingTextAlign}
      data-pp-style-color={messagingColor}
      data-pp-style-ratio={messagingRatio}
      data-pp-placement={messagingPlacement}
    ></div>
  );
};

export default PaylaterMessaging;
