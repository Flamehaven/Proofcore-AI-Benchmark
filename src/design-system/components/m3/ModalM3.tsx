/**
 * [*] Material Design 3 Modal Dialog Component
 * v1.0.2: M3 Design System Completion
 */

import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions: ModalAction[];
}

const Scrim = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.32);
  display: ${props => (props.open ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => (props.open ? 1 : 0)};
  transition: opacity 0.2s;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 4px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  max-width: 560px;
  width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Header = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`;

const Content = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;

  ${props =>
    props.variant === 'primary'
      ? `
    background-color: #1976D2;
    color: white;
    &:hover {
      background-color: #1565C0;
    }
    &:active {
      background-color: #0D47A1;
    }
  `
      : `
    background-color: transparent;
    color: #1976D2;
    &:hover {
      background-color: rgba(25, 118, 210, 0.04);
    }
    &:active {
      background-color: rgba(25, 118, 210, 0.08);
    }
  `}
`;

export const ModalM3: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions
}) => {
  return (
    <Scrim open={open} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
        </Header>
        <Content>{children}</Content>
        <Actions>
          {actions.map((action, idx) => (
            <ActionButton
              key={idx}
              variant={action.variant || 'secondary'}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </Actions>
      </ModalContainer>
    </Scrim>
  );
};

export default ModalM3;
