/*
 * Middleware для временной поддержки переходов из айфреймов Атласа
 * Преобразовывает старые ID рейсов в новые, и перенаправляет клиента
 * на страницу бронирования
 */
const ids = require('./ids.json');
const querystring = require('querystring');

const geoIds = ids.reduce(
    (acc, v) => ({
        ...acc,
        [v.id]: v.geoId,
    }),
    {}
);
const isDigits = s => {
    const pattern = new RegExp(/^\d{1,}$/);
    return pattern.test(s);
};

async function atlasRedirect(req, res, next) {
    try {
        const { from, to, tt, ns, ...otherQuery } = req.query;
        if (from && to && tt) {
            if (isDigits(from) && isDigits(to)) {
                const fromId = geoIds[parseInt(from)];
                const toId = geoIds[parseInt(to)];
                const tabletimeId = tt.replace(/\D/g, '');
                const passengers = ns || '1';
                const urlToRedirect =
                    `/booking/atlas:${tabletimeId}:${fromId}:${toId}:${passengers}?` +
                    querystring.stringify({
                        from: `c${fromId}`,
                        to: `c${toId}`,
                        date: new Date().toISOString().slice(0, 10),
                        passengers,
                        ...otherQuery,
                    });
                res.redirect(302, urlToRedirect);
                return;
            }
        }
        next();
    } catch (e) {
        console.error(e);
        next();
    }
}

module.exports = {
    atlasRedirect,
};
