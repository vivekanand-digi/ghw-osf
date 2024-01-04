import React from 'react';

const BackArrowIcon = props => {
  const {height = '', width = '', color = ''} = props;

  return (
    <svg width={width} height={height} color={color} viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.14062 0.945312C9.29688 1.0625 9.33594 1.21875 9.33594 1.375C9.33594 1.53125 9.29688 1.6875 9.17969 1.80469L2.07031 9.5L9.14062 17.2344C9.375 17.4688 9.375 17.8594 9.10156 18.0938C8.86719 18.3281 8.47656 18.3281 8.24219 18.0547L0.742188 9.92969C0.507812 9.69531 0.507812 9.34375 0.742188 9.10938L8.24219 0.984375C8.51562 0.710938 8.90625 0.710938 9.14062 0.945312Z"
        fill="#667085"
      />
    </svg>
  );
};

export default BackArrowIcon;
