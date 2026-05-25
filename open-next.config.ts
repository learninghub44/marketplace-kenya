import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default {
  buildCommand: 'npx next build',
  ...defineCloudflareConfig(),
}
