/**
 * [*] Button Component Stories
 * Storybook documentation for M3 Button
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ButtonM3 } from './ButtonM3';

const meta = {
  title: 'M3/Button',
  component: ButtonM3,
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!')
  }
} satisfies Meta<typeof ButtonM3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: 'Verify Proof'
  }
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Cancel'
  }
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: 'Learn More'
  }
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'Submit'
  }
};

export const Tonal: Story = {
  args: {
    variant: 'tonal',
    children: 'Secondary Action'
  }
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled'
  }
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button'
  }
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ButtonM3 variant="outlined">Cancel</ButtonM3>
      <ButtonM3 variant="filled">Verify</ButtonM3>
    </div>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ButtonM3 variant="filled">Filled</ButtonM3>
      <ButtonM3 variant="outlined">Outlined</ButtonM3>
      <ButtonM3 variant="text">Text</ButtonM3>
      <ButtonM3 variant="elevated">Elevated</ButtonM3>
      <ButtonM3 variant="tonal">Tonal</ButtonM3>
    </div>
  )
};
