module.exports = {
  reactStrictMode: true,
  rewrites: async function () {
    return [
      {
        source: "/products", // url asal/url baru
        destination: "/", // url tujuan/url lama
      },
    ];
  },
};
