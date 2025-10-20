/**
 * [*] Alert Component Stories
 * Storybook documentation for M3 Alert
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AlertM3 } from './AlertM3';

const meta = {
  title: 'M3/Alert',
  component: AlertM3,
  parameters: {
    layout: 'centered'
  },
  args: {
    title: 'Default Alert',
    message: 'This is a default alert message',
    severity: 'info'
  }
} satisfies Meta<typeof AlertM3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Error: Story = {
  args: {
    severity: 'error',
    title: 'Verification Failed',
    message: 'Proof contains logical inconsistencies or invalid expressions',
    action: {
      label: 'View Details',
      onClick: () => alert('Details clicked')
    }
  }
};

export const Warning: Story = {
  args: {
    severity: 'warning',
    title: 'Low Confidence',
    message: 'Proof verified with only 45% confidence. Review recommended.',
    action: {
      label: 'Learn More',
      onClick: () => alert('Learn more clicked')
    }
  }
};

export const Info: Story = {
  args: {
    severity: 'info',
    title: 'Information',
    message: 'Proof is currently being processed by the verification engine'
  }
};

export const Success: Story = {
  args: {
    severity: 'success',
    title: 'Verified Successfully',
    message: 'Proof passed all verification checks with 92% confidence',
    action: {
      label: 'View Result',
      onClick: () => alert('Result viewed')
    }
  }
};

export const ErrorWithoutAction: Story = {
  args: {
    severity: 'error',
    title: 'Network Error',
    message: 'Failed to connect to verification service. Please try again.'
  }
};

export const SuccessWithoutAction: Story = {
  args: {
    severity: 'success',
    title: 'Completed',
    message: 'Your proof has been successfully submitted and verified'
  }
};
