import { isCordova } from 'utils/platform';

const platform = isCordova ? 'cordova' : 'browser';
const { Search } = require(`components/Search/Search.${platform}`);

export default Search;
