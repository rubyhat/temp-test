export const pollingBackoff = [150, 150, 300, 300, 300, 1000];
export function getPollingDelay(count: number) {
    const delay =
        count > pollingBackoff.length
            ? pollingBackoff[pollingBackoff.length - 1]
            : pollingBackoff[count - 1];

    return delay;
}
