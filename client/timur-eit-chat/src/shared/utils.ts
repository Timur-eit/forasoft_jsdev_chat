export const getInviteLink = (): void => {
    const currentHref: string = window.location.href
    navigator.clipboard.writeText(currentHref)
      .then(() => alert('Link was coppied to clipboard'))    
}