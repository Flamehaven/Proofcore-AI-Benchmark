/**
 * [*] Material Design 3 TextField Component
 * v1.0.2: M3 Design System Completion
 */

import React, { useState } from 'react';
import styled from '@emotion/styled';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label<{ active: boolean; error?: string }>`
  font-size: ${props => (props.active ? '12px' : '14px')};
  color: ${props => {
    if (props.error) return '#D32F2F';
    return props.active ? '#1976D2' : 'rgba(0, 0, 0, 0.6)';
  }};
  transition: all 0.2s;
  font-weight: 500;
`;

const InputContainer = styled.div<{ error?: string; focused: boolean }>`
  position: relative;
  border-bottom: 2px solid
    ${props => {
      if (props.error) return '#D32F2F';
      return props.focused ? '#1976D2' : 'rgba(0, 0, 0, 0.12)';
    }};
  transition: border-color 0.2s;
  padding-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 8px 0;
  font-family: inherit;

  &::placeholder {
    color: transparent;
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.38);
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 8px 0;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &::placeholder {
    color: transparent;
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.38);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #D32F2F;
  margin-top: 4px;
`;

export const TextFieldM3: React.FC<TextFieldProps> = ({
  value,
  onChange,
  label,
  error,
  required,
  placeholder,
  type = 'text',
  disabled = false,
  multiline = false,
  rows = 4
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <Container>
      <Label active={focused || !!value || !!placeholder} error={error}>
        {label}
        {required && ' *'}
      </Label>
      <InputContainer error={error} focused={focused}>
        {multiline ? (
          <TextArea
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            aria-invalid={!!error}
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
          />
        )}
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default TextFieldM3;
