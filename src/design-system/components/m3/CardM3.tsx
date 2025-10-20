/**
 * [*] Material Design 3 Card Component
 * v1.0.2: M3 Design System Completion
 */

import React, { ReactNode } from 'react';
import styled from '@emotion/styled';

interface CardProps {
  title?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  elevated?: boolean;
  onClick?: () => void;
}

const CardContainer = styled.div<{ elevated?: boolean; clickable?: boolean }>`
  border-radius: 12px;
  padding: 16px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  ${props =>
    props.elevated &&
    `
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
    border: none;
  `}
  transition: all 0.2s;
  ${props => props.clickable && 'cursor: pointer;'}

  &:hover {
    ${props =>
      props.elevated &&
      `
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
        0 8px 10px 1px rgba(0, 0, 0, 0.14),
        0 3px 14px 2px rgba(0, 0, 0, 0.12);
    `}
    ${props => props.clickable && `background-color: rgba(0, 0, 0, 0.02);`}
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.87);
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

export const CardM3: React.FC<CardProps> = ({
  title,
  children,
  action,
  elevated = false,
  onClick
}) => {
  return (
    <CardContainer elevated={elevated} clickable={!!onClick} onClick={onClick}>
      {title && (
        <Header>
          <Title>{title}</Title>
        </Header>
      )}
      <Content>{children}</Content>
      {action && (
        <ActionButton onClick={action.onClick} style={{ marginTop: '12px' }}>
          {action.label}
        </ActionButton>
      )}
    </CardContainer>
  );
};

export default CardM3;
