module.exports = {
      trailingComma: 'es5',
      tabWidth: 4,
      useTabs: false,
      semi: true,
      singleQuote: true,
      bracketSpacing: false,
      bracketSameLine: true,
      overrides: [
            {
                  files: ['*.html', 'legacy/**/*.js'],
                  options: {
                        tabWidth: 4,
                  },
            },
      ],
};
