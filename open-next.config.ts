import { defineCloudflareConfig } from '@opennextjs/cloudflare';

/** OpenNext Cloudflare adapter — pairs with Wrangler; see https://opennext.js.org/cloudflare/get-started */
export default defineCloudflareConfig({
  // Enable R2 incremental cache after creating a bucket; see https://opennext.js.org/cloudflare/caching
  // incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  // queue: doQueue,
  // // This is only required if you use On-demand revalidation
  // tagCache: doShardedTagCache({ baseShardSize: 12 }),
  // // Disable this if you want to use PPR
  // enableCacheInterception: true,
  // // you can also use the `durableObject` option to use a durable object as a cache purge
  // cachePurge: purgeCache({ type: "direct" }),
});
