const config = require('../config');
const fs = require('fs');

const Mustache = require('mustache');

const configXml = Mustache.render(
    fs.readFileSync('config.template.xml').toString(), config,
)

fs.writeFileSync('config.xml', configXml);
