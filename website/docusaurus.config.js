/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'AutoUI',
  tagline: 'Automatic User Interface generation from schemas',
  url: 'https://mbovel.github.io/autoui',
  baseUrl: '/autoui/',
  favicon: 'img/favicon.ico',
  organizationName: 'mbovel', // Usually your GitHub org/user name.
  projectName: 'autoui', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'AutoUI',
      links: [
        { to: 'docs/intro', label: 'Docs', position: 'left' },
        { to: 'playground', label: 'Playground', position: 'left' },
        {
          href: 'https://github.com/mbovel/autoui',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/intro',
            },
          ],
        },
      ],
      logo: undefined,
      copyright: `Copyright © ${new Date().getFullYear()} Matthieu Bovel. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: "../docs",
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
