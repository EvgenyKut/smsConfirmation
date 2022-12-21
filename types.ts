import React from 'react';

import { OTPChallenge } from 'types/oneTimePassword/models';

export type SmsConfirmationProps = {
  initialOTPChallenge: OTPChallenge | undefined;
  smsInputCount: number;
  loaderChildren?: JSX.Element;
  withHeader?: boolean;
  headerleftIconVariant?: 'back' | 'close';
  headerTitle?: string;
  onSuccess: () => void;
  onError: (error: unknown) => void;
  onBackClick?: () => void;
};
export type SmsConfirmationFooterProps = {
  onSmsRetryButtonClick: (event?: React.MouseEvent) => void;
  timeout?: number;
  formattedTimeout?: string;
};
