import { hiddenHeaderAndFooter } from "@/lib/constants/routes"

export const hideHeaderAndFooter = (url) => {
    return hiddenHeaderAndFooter.some(route => url.includes(route))
}