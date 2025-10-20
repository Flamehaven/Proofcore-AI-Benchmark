/**
 * [*] Material Design 3 Button Component
 * v1.0.2: M3 Design System Completion
 */

import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const getVariantStyles = (variant: ButtonVariant) => {
  const base = `
    border: none;
    cursor: pointer;
    font-weight: 500;
    border-radius: 4px;
    transition: all 0.2s;
    font-family: inherit;
  `;

  const variants = {
    filled: `
      ${base}
      background-color: #1976D2;
      color: white;
      &:hover:not(:disabled) {
        background-color: #1565C0;
      }
      &:active:not(:disabled) {
        background-color: #0D47A1;
      }
    `,
    outlined: `
      ${base}
      background-color: transparent;
      color: #1976D2;
      border: 1px solid #1976D2;
      &:hover:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.04);
      }
      &:active:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.08);
      }
    `,
    text: `
      ${base}
      background-color: transparent;
      color: #1976D2;
      &:hover:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.08);
      }
      &:active:not(:disabled) {
        background-color: rgba(25, 118, 210, 0.12);
      }
    `,
    elevated: `
      ${base}
      background-color: #F5F5F5;
      color: #1976D2;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      &:hover:not(:disabled) {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      &:active:not(:disabled) {
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      }
    `,
    tonal: `
      ${base}
      background-color: #E3F2FD;
      color: #1565C0;
      &:hover:not(:disabled) {
        background-color: #BBDEFB;
      }
      &:active:not(:disabled) {
        background-color: #90CAF9;
      }
    `
  };

  return variants[variant];
};

const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    small: 'padding: 6px 12px; font-size: 12px;',
    medium: 'padding: 8px 24px; font-size: 14px;',
    large: 'padding: 12px 32px; font-size: 16px;'
  };
  return sizes[size];
};

const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
}>`
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  width: ${props => (props.fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

export const ButtonM3: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  onClick,
  fullWidth = false,
  type = 'button'
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      fullWidth={fullWidth}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

export default ButtonM3;
