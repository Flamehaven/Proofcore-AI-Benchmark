/**
 * [*] TextField Component Stories
 * Storybook documentation for M3 TextField
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextFieldM3 } from './TextFieldM3';

const meta = {
  title: 'M3/TextField',
  component: TextFieldM3,
  parameters: {
    layout: 'centered'
  },
  args: {
    label: 'Input Field',
    value: '',
    onChange: () => {}
  }
} satisfies Meta<typeof TextFieldM3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Proof Name"
          value={value}
          onChange={setValue}
          placeholder="Enter proof name"
        />
      </div>
    );
  }
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Proof Statement"
          value={value}
          onChange={setValue}
          error="Please enter a valid mathematical statement"
          placeholder="e.g., x + 2 = 5"
        />
      </div>
    );
  }
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Email"
          type="email"
          value={value}
          onChange={setValue}
          required
          placeholder="your@email.com"
        />
      </div>
    );
  }
};

export const Disabled: Story = {
  render: () => {
    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Verification Result"
          value="Score: 92/100"
          onChange={() => {}}
          disabled
        />
      </div>
    );
  }
};

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Password"
          type="password"
          value={value}
          onChange={setValue}
          required
          placeholder="Enter your password"
        />
      </div>
    );
  }
};

export const Multiline: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div style={{ width: '400px' }}>
        <TextFieldM3
          label="Proof Statement"
          value={value}
          onChange={setValue}
          multiline
          rows={5}
          placeholder="Enter your mathematical proof here..."
        />
      </div>
    );
  }
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('x + 2 = 5');

    return (
      <div style={{ width: '300px' }}>
        <TextFieldM3
          label="Mathematical Expression"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  }
};
