/**
 * Copyright (c) 2020, 2021 Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define([
  'jquery',
  'contentSDK',
  'serverUtils',
  'lib/utils.js',
  'services',
  'xss',
], ($, contentSDK, serverUtils, utils, services, xss) => {
  /**
   * Populate the article title
   *
   * @returns none
   * @param {string} content - The html content of the article
   *
   */

  function populateTitle(title, topicName, topicId) {
    // populate breadcrumb
    const breadcrumbHtml = `<ul>
                                <li><a href="index.html">Home</a></li>
                                <li><a href="articles.html?topicName=${topicName}&topicId=${topicId}">${topicName}</a></li>
                                <li>${title}</li>
                              </ul>`;
    $('#breadcrumb').append(breadcrumbHtml);
  }

  /**
   * Populate the article author information section
   *
   * @returns none
   * @param {ContentDeliveryClient} deliveryClient - The delivery client
   * @param {object} author - The author object of the article
   * @param {object} createdDate - The createdDate object of the article
   */

  function populateAuthor(deliveryClient, author, createdDate) {
    const imgElement = $('.author img');
    // Retrieve rendition url
    services
      .getMediumRenditionURL(deliveryClient, author.fields.avatar.id)
      .then((url) => {
        imgElement.attr('src', url);
      });
    $('.title').text(author.name);
    $('.date').text(`Posted on ${utils.dateToMDY(createdDate.value)}`);
  }

  /**
   * Populate the <img> used in the article
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {ContentDeliveryClient} deliveryClient - The delivery client
   * @param {string} articleImageIdentifier - The identifier of the article to display
   * @param {string} articleCaption - The caption for the article
   */

  function populateImage(
    deliveryClient,
    articleImageIdentifier,
    articleCaption,
  ) {
    const imgElement = $('#article > figure > img');
    $('#article > figure > figcaption').text(articleCaption);
    services
      .getRenditionURL(deliveryClient, articleImageIdentifier)
      .then((url) => {
        imgElement.attr('src', url);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Populate the article content
   *
   * @returns none
   * @param {string} content - The html content of the article
   *
   */

  function populateContent(content) {
    const articleContent = $('.content');
    const options = {
      stripIgnoreTag: true, // filter out all HTML not in the whitelist
      stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
      // to filter out its content
    };
    const cleanContent = xss(content, options);
    articleContent.html(cleanContent);
  }

  /**
   *  When the document has finished loading, fetch data from the SDK.
   *  For tutorial purposes only, any errors encountered are logged to the console
   */
  $(document).ready(() => {
    // Get the server configuration from the "oce.json" file
    serverUtils.parseServerConfig
      .then((serverconfig) => {
        // Obtain the delivery client from the Content Delivery SDK
        const deliveryClient = contentSDK.createDeliveryClient(serverconfig);

        const articleID = utils.getSearchParam('articleId');
        const topicId = utils.getSearchParam('topicId');
        const topicName = utils.getSearchParam('topicName');

        services
          .fetchArticle(deliveryClient, articleID)
          .then((article) => {
            $('#spinner').hide();
            populateTitle(article.name, topicName, topicId);
            populateAuthor(
              deliveryClient,
              article.fields.author,
              article.fields.published_date,
            );
            populateImage(
              deliveryClient,
              article.fields.image.id,
              article.fields.image_caption,
            );
            populateContent(article.fields.article_content);
          })
          .catch((error) => {
            $('#spinner').hide();
            console.error(error);
          });
      })
      .catch((error) => console.error(error)); // Error parsing JSON file
  });
});
