import React from 'react';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Helmet } from 'react-helmet';

import ProgressBar, { ProgressBarProps } from './ProgressBar';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  argTypes: {
    fill: { control: 'color' }
  }
} as Meta;

const LightTemplate: Story<ProgressBarProps> = (args) => (
  <div className="p-8">
    <Helmet htmlAttributes={{ 'data-theme': 'light' }} />
    <ProgressBar {...args} />
  </div>
);

const DarkTemplate: Story<ProgressBarProps> = (args) => (
  <div className="p-8">
    <Helmet htmlAttributes={{ 'data-theme': 'dark' }} />
    <ProgressBar {...args} />
  </div>
);

export const Primary = LightTemplate.bind({});
Primary.args = {
  max: 12,
  value: 8,
  fill: '#927CA1'
};

export const DarkCyan = DarkTemplate.bind({});
DarkCyan.args = {
  max: 12,
  value: 8,
  fill: '#21E4B9'
};
DarkCyan.parameters = {
  backgrounds: { default: 'dark' }
};
