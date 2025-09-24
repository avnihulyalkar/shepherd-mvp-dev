import { createConfig, http } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { porto } from 'porto/wagmi'
import { Mode, Dialog } from 'porto'

const isProd =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

    export const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        porto({
            // Use popup on localhost/dev (works on HTTP). Use iframe in prod (requires HTTPS).
            mode: Mode.dialog({ renderer: isProd ? Dialog.iframe() : Dialog.popup() }),
        }),
    ],
    transports: { [baseSepolia.id]: http() },
})
