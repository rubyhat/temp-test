#!/usr/bin/env node

const exec = require('child_process').exec;

const args = {
    specFile: './swagger/schema.json',
    generatorName: 'typescript-axios',
    output: './swagger/client',
    config: './swagger/config.json',
    template: './swagger/templates/typescript-axios',
};

exec(
    [
        'npx',
        '@openapitools/openapi-generator-cli@1.0.8-4.2.2',
        'generate',
        `--type-mappings Date=string`,
        `--skip-validate-spec`,
        `-i ${args.specFile}`,
        `-g ${args.generatorName}`,
        `-o ${args.output}`,
        `-c ${args.config}`,
        `-t ${args.template}`,
    ].join(' '),
    (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
    }
);
