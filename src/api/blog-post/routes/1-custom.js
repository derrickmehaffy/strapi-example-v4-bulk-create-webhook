module.exports = {
  routes: [
    {
      method: "POST",
      path: "/blog-posts/custom/bulkCreate",
      handler: "api::blog-post.blog-post.bulkCreate",
    },
  ],
};
