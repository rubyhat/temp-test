// Префиксы для SEO страниц
const seoPrefixes = [
    'Автобусы',
    'Маршруты',
    'Buses',
    'Directions',
    'Marszruta',
];

const seoPrefixesRegex = seoPrefixes.map(prefix => encodeURI(prefix)).join('|');

module.exports = {
    seoPrefixesRegex,
};
