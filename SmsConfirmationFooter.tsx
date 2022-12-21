import React from 'react';

import Text from '@vision/text';

import styles from './SmsConfirmation.module.pcss';
import { SmsRetryButton } from './SmsRetryButton';
import { SmsConfirmationFooterProps } from './types';

export const SmsConfirmationFooter = ({
  onSmsRetryButtonClick,
  timeout,
  formattedTimeout,
}: SmsConfirmationFooterProps) => {
  return (
    <div className={styles.text}>
      {timeout && timeout !== 0 ? (
        <Text type={'lineRegular'} color={'colorForeground2'}>
          {`Запросить новый код через ${formattedTimeout}`}
        </Text>
      ) : (
        <SmsRetryButton onClick={onSmsRetryButtonClick} />
      )}
    </div>
  );
};
