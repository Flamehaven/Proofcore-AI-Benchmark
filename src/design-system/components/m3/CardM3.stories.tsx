/**
 * [*] Card Component Stories
 * Storybook documentation for M3 Card
 */

import type { Meta, StoryObj } from '@storybook/react';
import { CardM3 } from './CardM3';

const meta = {
  title: 'M3/Card',
  component: CardM3,
  parameters: {
    layout: 'centered'
  },
  args: {
    children: 'Card content goes here'
  }
} satisfies Meta<typeof CardM3>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Proof Result',
    children: 'Your proof has been successfully verified with a score of 92/100.'
  }
};

export const WithAction: Story = {
  args: {
    title: 'Verification Details',
    children:
      'This proof demonstrates strong logical structure and mathematical soundness.',
    action: {
      label: 'View Full Report',
      onClick: () => alert('Showing full report...')
    }
  }
};

export const Elevated: Story = {
  args: {
    elevated: true,
    title: 'Featured Proof',
    children:
      'This is a recently verified proof that scored exceptionally high in all categories.',
    action: {
      label: 'Explore',
      onClick: () => alert('Exploring...')
    }
  }
};

export const Clickable: Story = {
  args: {
    title: 'Proof #42',
    children: 'Click this card to view details',
    onClick: () => alert('Card clicked!')
  }
};

export const WithoutTitle: Story = {
  args: {
    children:
      'This card has no title. It can be used for simple information display or as a container for other components.'
  }
};

export const Statistics: Story = {
  args: {
    title: 'Verification Statistics',
    children: (
      <div>
        <p>
          <strong>Total Proofs:</strong> 1,245
        </p>
        <p>
          <strong>Verified:</strong> 1,102 (88%)
        </p>
        <p>
          <strong>Pending:</strong> 143 (12%)
        </p>
      </div>
    )
  }
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
      <CardM3 title="Card 1" children="First card content" />
      <CardM3 title="Card 2" elevated children="Second card (elevated)" />
      <CardM3
        title="Card 3"
        children="Third card with action"
        action={{ label: 'Action', onClick: () => alert('Clicked!') }}
      />
      <CardM3 title="Card 4" children="Fourth card" />
    </div>
  )
};

export const LongContent: Story = {
  args: {
    title: 'Proof Analysis',
    children: (
      <div>
        <p>
          This proof demonstrates the Pythagorean theorem through geometric
          construction. The analysis reveals:
        </p>
        <ul>
          <li>Strong logical progression</li>
          <li>Correct mathematical notation</li>
          <li>Valid proof techniques</li>
          <li>Clear reasoning steps</li>
        </ul>
      </div>
    ),
    action: {
      label: 'Download',
      onClick: () => alert('Downloading...')
    }
  }
};
