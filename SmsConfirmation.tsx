import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CircleLoader from '@vision/circle-loader';
import Text from '@vision/text';

import { useOtpConfirmMutation, useOtpRenewMutation } from 'core/api/oneTimePassword';

import { isOTPConfirmErrorType } from 'utils/oneTimePassword';

import SomethingWentWrong from 'modules/SomethingWentWrong/SomethingWentWrong';

import { HeaderPage } from 'components';
import { createAlertNotification } from 'components/Alert/createAlertNotification';
import SmsInput from 'components/SmsInput';

import styles from './SmsConfirmation.module.pcss';
import { SmsConfirmationFooter } from './SmsConfirmationFooter';
import { buttonText, text, title } from './const';
import { SmsConfirmationProps } from './types';
import { useTimer } from './useTimer';

const SmsConfirmation = ({
  initialOTPChallenge,
  smsInputCount,
  loaderChildren,
  withHeader,
  headerleftIconVariant,
  headerTitle,
  onSuccess,
  onError,
  onBackClick,
}: SmsConfirmationProps) => {
  const [
    otpConfirm,
    {
      isLoading: isOTPConfirmLoading,
      error: otpConfirmError,
      isError: isOTPConfirmError,
      isSuccess: isOTPConfirmSuccess,
      reset: resetOTPConfirm,
    },
  ] = useOtpConfirmMutation();
  const [
    otpRenew,
    {
      data: otpRenewData,
      isLoading: isOTPRenewLoading,
      error: otpRenewError,
      isError: isOTPRenewError,
      isSuccess: isOTPRenewSuccess,
      isUninitialized: isOTPRenewUninitialized,
    },
  ] = useOtpRenewMutation();

  const currentOTPChallenge =
    !isOTPRenewUninitialized && isOTPRenewSuccess && otpRenewData?.otpChallenge
      ? otpRenewData.otpChallenge
      : initialOTPChallenge;

  const navigate = useNavigate();

  const { currentCount, formattedTimeout, startTimer, resetTimer } = useTimer(
    currentOTPChallenge?.timeout,
  );

  useEffect(() => {
    if (currentOTPChallenge?.timeout) {
      startTimer();
    }
  }, [startTimer, currentOTPChallenge]);

  const handleSmsInputChange = async (value: string) => {
    if (value.length === smsInputCount && currentOTPChallenge?.operationId) {
      try {
        await otpConfirm({ OTP: value, OperationId: currentOTPChallenge.operationId }).unwrap();
      } catch (error) {
        onError(error);
      }
    }
  };

  const handleSmsRetryButtonClick = async () => {
    if (currentOTPChallenge?.operationId) {
      try {
        await otpRenew({ OperationId: currentOTPChallenge.operationId }).unwrap();
        resetOTPConfirm();
        resetTimer();
      } catch (error) {
        onError(error);
      }
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (isOTPConfirmSuccess) {
      onSuccess();
    }
  }, [isOTPConfirmSuccess, onSuccess]);

  useEffect(() => {
    if (isOTPConfirmError && isOTPConfirmErrorType(otpConfirmError)) {
      createAlertNotification({
        text: otpConfirmError.data.Error[0].ErrorMessageText,
        status: 'error',
      });
    }
  }, [isOTPConfirmError, otpConfirmError]);

  useEffect(() => {
    if (isOTPRenewError && isOTPConfirmErrorType(otpRenewError)) {
      createAlertNotification({
        text: otpRenewError.data.Error[0].ErrorMessageText,
        status: 'error',
      });
    }
  }, [isOTPRenewError, otpRenewError]);

  //@ts-ignore
  if (otpConfirmError?.status === 'FETCH_ERROR') {
    return (
      <SomethingWentWrong
        title={title}
        text={text}
        buttonText={buttonText}
        onAction={handleSmsRetryButtonClick}
        loading={isOTPRenewLoading}
      />
    );
  }

  if (isOTPConfirmLoading || isOTPRenewLoading) {
    return (
      <div className={styles.loaderContainer}>
        {withHeader && (
          <HeaderPage
            title={headerTitle}
            leftIconVariant={headerleftIconVariant}
            onLeftIconClick={handleBackClick}
          />
        )}
        <CircleLoader size={36} />
        {isOTPRenewLoading ? <Text>Запрос нового СМС-кода...</Text> : loaderChildren}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <HeaderPage
        title={'СМС-подтверждение'}
        leftIconVariant={'back'}
        onLeftIconClick={handleBackClick}
      />
      <div className={styles.text}>
        <Text type={'bodyMedium'}>{`Enter the code sent to the number:`}</Text>
        <Text type={'bodyMedium'}>{currentOTPChallenge?.maskedPhone}</Text>
      </div>
      <div className={styles.container}>
        <div className={styles.smsInputContainer}>
          <SmsInput count={smsInputCount} onChange={handleSmsInputChange} />
        </div>
        <SmsConfirmationFooter
          onSmsRetryButtonClick={handleSmsRetryButtonClick}
          timeout={currentCount}
          formattedTimeout={formattedTimeout}
        />
      </div>
    </div>
  );
};

export default SmsConfirmation;
