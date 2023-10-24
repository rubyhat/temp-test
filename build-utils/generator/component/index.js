// @ts-check

const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');

const baseFolder = 'components';

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.argument('component', { type: String, required: false });
    }
    async prompting() {
        let { component } = this.options;
        if (!component) {
            const answers = await this.prompt([
                {
                    type: 'input',
                    name: 'component',
                    message: 'Component name',
                    required: true,
                },
            ]);
            component = answers.component;
        }
        this.answers = {
            name: path.basename(component),
            folder: path.join(baseFolder, path.dirname(component)),
        };

        this.log('Block name', this.answers.name);
        this.log('Folder', this.answers.folder);
    }

    writing() {
        const { name, folder } = this.answers;
        const destFolder = path.join(folder, name);

        fs.statSync(this.destinationPath(folder));

        this.fs.copyTpl(
            this.templatePath('component.tsx.tmpl'),
            this.destinationPath(path.join(destFolder, `${name}.tsx`)),
            {
                name,
            }
        );
        this.fs.copyTpl(
            this.templatePath('component.styl.tmpl'),
            this.destinationPath(path.join(destFolder, `${name}.styl`)),
            {
                name,
            }
        );
        this.fs.copyTpl(
            this.templatePath('component.story.tmpl'),
            this.destinationPath(path.join(destFolder, `${name}.story.tsx`)),
            {
                name,
            }
        );
    }
};
