"use strict";

/**
 * blog-post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }) => ({
    async bulkCreate(ctx) {
      /* Check request type, this was just for basic testing, expects format like:
      {
        "data": [
          {
            "title": "Test 1",
            "comments": [1,2]
          }
        ]
      }
      */

      if (Array.isArray(ctx.request.body.data) === false) {
        // If not array then return bad request
        return ctx.badRequest("Expected an array of data.");
      } else if (ctx.request.body.data.length > 0) {
        // Construct variables to hold responses and errors for specific entry skipping if error
        let responses = [];
        let errors = [];

        // Loop through each entry and attempt to create
        for (let i = 0; i < ctx.request.body.data.length; i++) {
          try {
            const entity = await strapi.entityService.create(
              "api::blog-post.blog-post",
              {
                populate: "*", // Need this for webhook response but also forces population in the response too
                data: ctx.request.body.data[i],
              }
            );

            // Really should sanitize this response but instead of entityService you could also use super.create() instead but you would need to custom construct the ctx
            // Omitting Sanitization just to show the webhook
            responses.push(entity);
          } catch (e) {
            errors.push({
              entryIndex: i,
              entryRaw: ctx.request.body.data[i],
            });
          }
        }

        // Return the responses and errors
        // Technically you don't need to return the exact data, you could just return the IDs of the entries created to limit sanitization needs
        return {
          data: responses,
          errors,
        };

        // return generic error if something really bad happened
      } else return ctx.badRequest("No data provided or invalid format");
    },
  })
);
