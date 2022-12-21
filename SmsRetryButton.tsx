import React from 'react';

import Button from '@vision/button';
import Text from '@vision/text';

import styles from './SmsConfirmation.module.pcss';

type SmsRetryButtonProps = {
  onClick: (event?: React.MouseEvent) => void;
};
export const SmsRetryButton = ({ onClick }: SmsRetryButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={styles.btn}
      classNameContent={styles.btnWrapper}
      size={'s'}
    >
      <Text type={'lineSemiBold'} color={'colorAccent'}>
        Submit new code
      </Text>
    </Button>
  );
};
