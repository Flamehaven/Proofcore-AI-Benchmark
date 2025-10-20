/**
 * [*] Modal Component Stories
 * Storybook documentation for M3 Modal
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ModalM3 } from './ModalM3';
import styled from '@emotion/styled';

const Button = styled.button`
  padding: 8px 16px;
  background-color: #1976D2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #1565C0;
  }
`;

const ModalWrapper = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      {children({ open, setOpen })}
    </>
  );
};

const meta = {
  title: 'M3/Modal',
  component: ModalM3,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof ModalM3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalM3
          open={open}
          onClose={() => setOpen(false)}
          title="Proof Verification Details"
          actions={[
            {
              label: 'Cancel',
              onClick: () => setOpen(false),
              variant: 'secondary'
            },
            {
              label: 'Verify',
              onClick: () => alert('Verified!'),
              variant: 'primary'
            }
          ]}
        >
          <p>This proof has been analyzed and shows strong logical structure.</p>
          <p>Would you like to proceed with verification?</p>
        </ModalM3>
      </>
    );
  }
};

export const ConfirmDelete: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete Proof</Button>
        <ModalM3
          open={open}
          onClose={() => setOpen(false)}
          title="Delete Proof?"
          actions={[
            {
              label: 'Keep It',
              onClick: () => setOpen(false),
              variant: 'secondary'
            },
            {
              label: 'Delete',
              onClick: () => {
                alert('Deleted!');
                setOpen(false);
              },
              variant: 'primary'
            }
          ]}
        >
          <p>Are you sure you want to delete this proof?</p>
          <p>This action cannot be undone.</p>
        </ModalM3>
      </>
    );
  }
};

export const Information: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Show Info</Button>
        <ModalM3
          open={open}
          onClose={() => setOpen(false)}
          title="Verification Results"
          actions={[
            {
              label: 'Close',
              onClick: () => setOpen(false),
              variant: 'primary'
            }
          ]}
        >
          <p>
            <strong>Score:</strong> 92/100
          </p>
          <p>
            <strong>Confidence:</strong> High (92%)
          </p>
          <p>
            <strong>Status:</strong> Verified
          </p>
        </ModalM3>
      </>
    );
  }
};

export const MultipleActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalM3
          open={open}
          onClose={() => setOpen(false)}
          title="Export Proof"
          actions={[
            {
              label: 'Cancel',
              onClick: () => setOpen(false),
              variant: 'secondary'
            },
            {
              label: 'Export as JSON',
              onClick: () => alert('Exported as JSON'),
              variant: 'secondary'
            },
            {
              label: 'Export as PDF',
              onClick: () => alert('Exported as PDF'),
              variant: 'primary'
            }
          ]}
        >
          <p>Choose the format to export your proof:</p>
          <ul>
            <li>JSON: Machine-readable format</li>
            <li>PDF: Human-readable document</li>
          </ul>
        </ModalM3>
      </>
    );
  }
};
