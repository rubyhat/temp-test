import { name, version } from '../package.json';

export function getReleaseVersion() {
    return `${name}@${version}`;
}

export function getReleaseVersionCompass() {
    return `compass@${version}`;
}
