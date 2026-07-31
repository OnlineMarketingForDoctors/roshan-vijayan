import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xtpxp7mw',
    dataset: 'production',
  },
  /* Deploys the studio to a *.sanity.studio subdomain. Pick one on first `sanity deploy`. */
  studioHost: 'rv-plastic-surgery',
})
