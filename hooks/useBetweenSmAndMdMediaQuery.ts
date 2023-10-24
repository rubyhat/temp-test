import useMediaQuery from '@material-ui/core/useMediaQuery';

export const betweenSmAndMdQueryDown = '(max-width:1128px)';

// На границе sm и md
export function useBetweenSmAndMdMediaQuery() {
    return useMediaQuery(betweenSmAndMdQueryDown);
}
