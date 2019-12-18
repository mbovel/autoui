/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'AllUI',
  tagline: 'A Javascript library to build user interfaces from schemas',
  url: 'https://mbovel.github.io/allui',
  baseUrl: '/allui/',
  favicon: 'img/favicon.ico',
  organizationName: 'mbovel', // Usually your GitHub org/user name.
  projectName: 'allui', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/motivation', label: 'Docs', position: 'left' },
        {
          href: 'https://github.com/facebook/docusaurus',
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
              to: 'docs/motivation',
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
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
