import {get, derived, writable} from "svelte/store";

export const tokenClient = writable(null)

export const gapiInited = writable(false)
export const gisInited = writable(false)

export const isAuthorizeButtonVisible = writable(false)
export const isSingoutButtonVisible = writable(false)

