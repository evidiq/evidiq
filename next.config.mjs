/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // Keep heavy / native server deps out of the bundle; load them at runtime.
  serverExternalPackages: ["@0gfoundation/0g-ts-sdk", "ethers"],

  // /blog reads `searchParams` for its `?page=` pagination, which makes it dynamic by
  // definition in the App Router — `export const revalidate` cannot apply to it. Left
  // alone, Next answers with
  // `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`, and a page
  // that tells crawlers not to store it does not stay in the index. Measured 2026-08-04:
  // / and /blog both sent that header while /faq and /playground were cached normally.
  //
  // These headers are asserted at the routing layer instead. Verify against the live URL
  // after deploying, not against the build output: if Next still wins on /blog, the real
  // fix is to move pagination out of the query string into /blog/page/[n] segments, which
  // is the better SEO shape anyway.
  async headers() {
    return [
      {
        source: "/blog",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/blog/:path*",
        headers: [
          {
            key: "cache-control",
            value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
