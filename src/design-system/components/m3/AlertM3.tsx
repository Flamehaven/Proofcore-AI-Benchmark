/**
 * [*] Material Design 3 Alert Component
 * v1.0.2: M3 Design System Completion
 */

import React from 'react';
import styled from '@emotion/styled';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  severity: AlertSeverity;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

const AlertContainer = styled.div<{ severity: AlertSeverity }>`
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 4px;
  background-color: ${props => {
    const colors = {
      error: '#FFE5E5',
      warning: '#FFF3E0',
      info: '#E3F2FD',
      success: '#E8F5E9'
    };
    return colors[props.severity];
  }};
  border-left: 4px solid ${props => {
    const colors = {
      error: '#D32F2F',
      warning: '#F57C00',
      info: '#1976D2',
      success: '#388E3C'
    };
    return colors[props.severity];
  }};
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  font-size: 18px;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const Message = styled.div`
  font-size: 13px;
  opacity: 0.87;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  color: #1976D2;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

export const AlertM3: React.FC<AlertProps> = ({
  severity,
  title,
  message,
  action,
  onClose
}) => {
  const getIcon = () => {
    const icons = {
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
      success: '✓'
    };
    return icons[severity];
  };

  return (
    <AlertContainer severity={severity} role="alert">
      <IconContainer>{getIcon()}</IconContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </ContentContainer>
      {action && (
        <ActionButton onClick={action.onClick}>
          {action.label}
        </ActionButton>
      )}
    </AlertContainer>
  );
};

export default AlertM3;
