export const sendEventGA = (category: string) => {
    // @ts-ignore
        gtag('event', category);
}
