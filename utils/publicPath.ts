const CDNPublicPath = process.env.STATIC_BASE_URL
    ? `${process.env.STATIC_BASE_URL}/${process.env.BUILD_VERSION}`
    : 'https://storage.googleapis.com/' +
      process.env.STORAGE_BUCKET_NAME +
      '/' +
      process.env.BUILD_VERSION;

export function publicPath(path: string) {
    if (
        process.env.NODE_ENV !== 'production' ||
        process.env.CORDOVA === 'true' ||
        process.env.ENABLE_CDN !== 'true'
    ) {
        return path;
    }

    return `${CDNPublicPath}${path}`;
}
