import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* 90 — для зернистых «плёночных» фото (создатели, коллаж «Нам по пути»):
       Sanity уже отдаёт кадр со своим сжатием, и повторное перекодирование
       оптимизатором Next с умолчательным качеством 75 превращало зерно в
       квадратную кашу (замер 11.09). Проп `quality` у `SanityImage`. */
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
