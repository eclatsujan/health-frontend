import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import { purgeCache } from "@opennextjs/cloudflare/overrides/cache-purge/index";

/** OpenNext Cloudflare adapter — pairs with Wrangler; see https://opennext.js.org/cloudflare/get-started */
export default defineCloudflareConfig({
  // Enable R2 incremental cache after creating a bucket; see https://opennext.js.org/cloudflare/caching
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: doQueue,
  // This is only required if you use On-demand revalidation
  tagCache: doShardedTagCache({ baseShardSize: 12 }),
  // Disable this if you want to use PPR
  enableCacheInterception: true,
  // you can also use the `durableObject` option to use a durable object as a cache purge
  cachePurge: purgeCache({ type: "direct" }),
});
