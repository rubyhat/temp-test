export function footerText(companyName: string) {
    const year = new Date().getFullYear();

    return `${year} © ${companyName}`;
}
