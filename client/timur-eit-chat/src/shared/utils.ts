export const getInviteLink = (): void => {
    const currentHref: string = window.location.href
    navigator.clipboard.writeText(currentHref)
      .then(() => alert('Link was coppied to clipboard'))
}

export function messageValid(value: string): string | null {
    if (value.length > 50) {
        return 'Value must be not more than 50 symbols';
    }
    if (value.length === 0 || value.trim().length === 0) {
        return 'Value must not be empty';
    }
    return null;
}