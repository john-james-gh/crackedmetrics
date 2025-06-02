import type {KnipConfig} from 'knip';

const config: KnipConfig = {
  workspaces: {
    '.': {
      ignoreDependencies: [
        '@eslint/js',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react',
        'eslint-plugin-react-hooks',
        'typescript-eslint',
      ],
    },
  },
};

export default config;
