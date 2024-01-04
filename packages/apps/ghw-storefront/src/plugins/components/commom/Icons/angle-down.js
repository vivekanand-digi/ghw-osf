import React from 'react';

const AngleDownIcon = props => {
  const {height = '', width = '', color = ''} = props;

  return (
    <svg width={width} height={height} color={color} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.875 2.84766L9.75 9.55078C9.51562 9.78516 9.23438 9.87891 9 9.87891C8.71875 9.87891 8.4375 9.78516 8.20312 9.59766L1.07812 2.84766C0.609375 2.42578 0.609375 1.72266 1.03125 1.25391C1.45312 0.785156 2.15625 0.785156 2.625 1.20703L9 7.20703L15.3281 1.20703C15.7969 0.785156 16.5 0.785156 16.9219 1.25391C17.3438 1.72266 17.3438 2.42578 16.875 2.84766Z"
        fill="#D0D5DD"
      />
    </svg>
  );
};

export default AngleDownIcon;
