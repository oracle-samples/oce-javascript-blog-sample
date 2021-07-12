/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define([
  'jquery',
  'serverUtils',
  'lib/utils.js',
  'services',
], ($, serverUtils, utils, services) => {
  /**
   * Create and populate the <img> used to represent the thumbnail of the article
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {object} parentContainer - The DOM element into which the list of articles will render
   * @param {string} thumbnailIdentifier - The identifier of the thumbnail to display
   *
   */
  function createArticleThumbnail(
    client,
    articleContainer,
    imageIdentifier,
  ) {
    // create the image element first else placement is not guaranteed as it will depend
    // on when response comes back
    const imgElement = $('<img />').appendTo(articleContainer);
    services.getMediumRenditionURL(client, imageIdentifier)
      .then((url) => {
        utils.getImageUrl(url)
          .then((formattedUrl) => {
            imgElement.attr('src', formattedUrl);
          });
      })
      .catch((error) => console.error(error));
  }

  /**
   * Create the DOM element that will contain a single article
   *
   * Articles are formatted accordinding the CSS defined for the class #articles .article
   *
   * @returns {object} - the DOM container for this single article
   * @param {object} parentContainer - The DOM element into which the list of articles will render
   * @param {object} article - The article to display
   *
   */
  function createArticleListItem(
    client,
    parentContainer,
    article,
    topicName,
    topicId,
  ) {
    const articleContainer = $('<div />')
      .attr('class', 'article')
      .click(() => {
        window.location.href = `article.html?articleId=${article.id}&topicName=${topicName}&topicId=${topicId}`;
      })
      .appendTo(parentContainer);
    const div = $('<div>')
      .attr('class', 'title-date')
      .appendTo(articleContainer);
    $('<h4 />').attr('class', 'title').text(article.name).appendTo(div);
    $('<div />')
      .text(`Posted on ${utils.dateToMDY(article.fields.published_date.value)}`)
      .attr('class', 'date')
      .appendTo(div);
    createArticleThumbnail(
      client,
      articleContainer,
      article.fields.image.id,
    );

    $('<div />')
      .text(article.description)
      .attr('class', 'description')
      // .text(article.fields.articlecontent)
      .appendTo(articleContainer);

    return articleContainer;
  }

  /**
   *  When the document has finished loading, fetch data from the SDK.
   *  For tutorial purposes only, any errors encountered are logged to the console
   */
  $(document).ready(() => {
    // Get the server configuration from the "content.json" file
    serverUtils.getClient
      .then((client) => {
        const topicId = utils.getSearchParam('topicId');
        const topicName = utils.getSearchParam('topicName');

        services.fetchArticles(client, topicId)
          .then((articles) => {
            $('#spinner').hide();
            // populate breadcrumb
            $('#breadcrumb').append(
              `<ul><li><a href="index.html">Home</a></li><li>${topicName}</li></ul>`,
            );

            const container = $('#articles');

            articles.forEach((article) => {
              createArticleListItem(
                client,
                container,
                article,
                topicName,
                topicId,
              );
            });
          })
          .catch((error) => {
            $('#spinner').hide();
            console.error(error);
          });
      })
      .catch((error) => console.error(error)); // Error parsing JSON file
  });
});
