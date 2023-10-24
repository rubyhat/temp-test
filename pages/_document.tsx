import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';

import theme from 'themes/default';
import { BrandState } from 'store/brand/types';
import { favicon } from 'saas/favicon';
import { publicPath } from 'utils/publicPath';

class MyDocument extends Document {
    render() {
        const brand: BrandState = (this.props as any).brand;
        const isAtlas = brand.brandName === 'atlas';
        const inWebView = brand.inWebView;

        const favicon32 = favicon('32x32', brand);
        const favicon16 = favicon('16x16', brand);

        return (
            <html>
                <Head>
                    <meta charSet="utf-8" />
                    {/* PWA primary color */}
                    <meta
                        name="theme-color"
                        content={theme.palette.primary.main}
                    />
                    <meta name="format-detection" content="telephone=no" />
                    <link rel="shortcut icon" href={favicon('ico', brand)} />

                    {/* Workaround: не предлагать Атлас приложение у партнеров */}
                    {isAtlas && (
                        <>
                            <link
                                rel="apple-touch-icon"
                                sizes="180x180"
                                href={publicPath(
                                    '/static/img/apple-touch-icon.png'
                                )}
                            />
                        </>
                    )}

                    {favicon32 && (
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="32x32"
                            href={favicon32}
                        />
                    )}
                    {favicon16 && (
                        <link
                            rel="icon"
                            type="image/png"
                            sizes="16x16"
                            href={favicon16}
                        />
                    )}
                    <link rel="shortcut icon" href={favicon('ico', brand)} />

                    {/* Workaround: статика которая пока не настраивается в SaaS'е */}
                    {isAtlas && (
                        <>
                            <link
                                rel="mask-icon"
                                href={publicPath(
                                    '/static/img/safari-pinned-tab.svg'
                                )}
                                color="#5bbad5"
                            />
                            <meta
                                name="msapplication-TileColor"
                                content="#2b5797"
                            />
                            <meta
                                name="msapplication-config"
                                content="/static/img/browserconfig.xml"
                            />
                        </>
                    )}
                    <meta name="theme-color" content="#ffffff" />

                    {isAtlas && (
                        <>
                            <link
                                rel="alternate"
                                href="https://atlasbus.ru/"
                                hrefLang="ru-ru"
                            />
                            <link
                                rel="alternate"
                                href="https://atlasbus.by/"
                                hrefLang="ru-by"
                            />
                            <link
                                rel="alternate"
                                href="https://atlasbus.pl/"
                                hrefLang="pl-pl"
                            />
                        </>
                    )}
                    {process.env.CORDOVA ? (
                        <script src="cordova.js"></script>
                    ) : inWebView ? (
                        <script src="ionic://app/cordova.js" />
                    ) : null}
                </Head>
                <body style={{ overflow: 'auto' }}>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async ctx => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    const { brand } = ctx.store.getState();

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [
            ...React.Children.toArray(initialProps.styles),
            sheets.getStyleElement(),
        ],
        brand,
    };
};

export default MyDocument;
