import config from '@benhigham/eslint-config';

const tsconfigConfig = [
  ...config,
  {
    files: ['src/**/*.json'],
    rules: {
      'no-secrets/no-secrets': 'off',
    },
  },
];

export default tsconfigConfig;
