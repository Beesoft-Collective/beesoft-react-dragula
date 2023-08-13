import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import pkg from '../package.json';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: `BeeSoft React Dragula v${pkg.version}`,
  }),
});
