/**
 * Copyright (c) 2020 Oracle and/or its affiliates. All rights reserved.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */

define([
  'jquery',
  'contentSDK',
  'scripts/server-config-utils.js',
  'scripts/services.js',
], ($, contentSDK, serverUtils, services) => {
  /**
   * Display error message if content couldn't be loaded
   */
  function displayError() {
    const html = '<div class="error">Oops, something went wrong.  Please verify that you have seeded data to the server and configured your serverUrl and channelToken.</div>';
    $('#topics').append(html);
  }

  /**
   * Set the title in the home page's header<br/>
   *
   * @returns none
   * @param {string} title - The text value representing the value to display in the page header
   *
   */
  function populateHeaderTitle(title) {
    $('#company-title').text(title);
  }

  /**
   * Find the reference to the header thumbnail on the home page and populate its
   * source value with the URL of the thumbnail to display.
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {ContentDeliveryClient} deliveryClient - The delivery client
   * @param {string} logoID - The identifier of the company logo's digital asset
   *
   */
  function populateHeaderImage(deliveryClient, logoID) {
    // create header
    services
      .getRenditionURL(deliveryClient, logoID)
      .then((url) => {
        $('#company-thumbnail')
          .attr('src', `${url}`)
          .attr('alt', 'Company Logo');
      })
      .catch((error) => console.error(error));
  }

  /**
   * Set the About Us and Contact Us links in the header<br/>
   *
   * @returns none
   * @param {string} aboutUrl - The Url for the About Us link in the page header
   * @param {string} contactUrl - The Url for the Contact Us link in the page header
   */
  function populateHeaderUrls(aboutUrl, contactUrl) {
    $('#about').attr('href', aboutUrl);
    $('#contact').attr('href', contactUrl);
  }

  /**
   * Append the topic title to the topic container
   *
   * @returns none
   * @param {object} parentContainer - The DOM element representing a single topic
   * @param {string} text - The title of the topic
   *
   */
  function appendTopicTitle(parentContainer, text) {
    const html = `<div class="button-wrapper">
                        <div class="button">${text}</div>
                    </div>`;
    parentContainer.append(html);
  }

  /**
   * Create and populate the <img> used to represent the thumbnail of the topic
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {ContentDeliveryClient} deliveryClient - The delivery client
   * @param {object} parentContainer - The DOM element into which the list of topics will render
   * @param {string} thumbnailIdentifier - The identifier of the thumbnail to display
   *
   */
  function appendTopicThumbnail(
    deliveryClient,
    parentContainer,
    thumbnailIdentifier,
  ) {
    const imgElement = $('<img />').appendTo(parentContainer);

    services
      .getMediumRenditionURL(deliveryClient, thumbnailIdentifier)
      .then((url) => {
        imgElement.attr('src', url);
      })
      .catch((error) => console.error(error));
  }

  /**
   * Append the topic detail to the topic container
   *
   * @returns none
   * @param {object} parentContainer - The DOM element into which the list of topics will render
   * @param {string} detailText - The detail content of the topic
   *
   */
  function appendTopicDetail(parentContainer, detailText) {
    // Strip out html from the text
    // let plainText = $(detailText).text();
    const html = `<div class="desc-wrapper"><div class="description">${detailText}</div></div>`;
    parentContainer.append(html);
  }

  /**
   * Given a collection of topic identifiers, fetch information about each one so that the topic
   * listing can be rendered on the home page.
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {ContentDeliveryClient} deliveryClient - The delivery client
   * @param {[string]} topics - A collection of identifiers representing the topics to display
   * @param {object} container - The DOM element into which the topic should be rendered.
   *
   */
  function populateTopicListing(deliveryClient, topicIdentifiers, container) {
    // Fetch information about each topic so that we can display all of the detail information
    // about the topic
    topicIdentifiers.forEach((id) => {
      // Create the DOM element that will contain a single topic
      const topicContainer = $('<div />')
        .attr({ class: 'topic' })
        .appendTo(container);

      // fetch the topic
      services
        .fetchTopic(deliveryClient, id)
        .then((topic) => {
          // assign a click event on the topic container
          topicContainer.click(() => {
            window.location.href = `./articles.html?topicName=${encodeURIComponent(
              topic.name,
            )}&topicId=${encodeURIComponent(topic.id)}`;
          });
          appendTopicTitle(topicContainer, topic.name);
          appendTopicThumbnail(
            deliveryClient,
            topicContainer,
            topic.fields.thumbnail.id,
          );
          appendTopicDetail(topicContainer, topic.description);
        })
        .catch((error) => console.error(error));
    });
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

        // get the top level topics
        services
          .fetchHomePage(deliveryClient)
          .then((topLevelItem) => {
            $('#spinner').hide();
            populateHeaderTitle(topLevelItem.title);
            populateHeaderImage(deliveryClient, topLevelItem.logoID);
            populateHeaderUrls(topLevelItem.aboutUrl, topLevelItem.contactUrl);

            const container = $('#topics');
            const topicIdentifiers = topLevelItem.topics.map(
              (topic) => topic.id,
            );
            populateTopicListing(deliveryClient, topicIdentifiers, container);
          })
          .catch((error) => {
            $('#spinner').hide();
            console.log(error); // Error getting top level elements
            displayError();
          });
      })
      .catch((error) => {
        $('#spinner').hide();
        console.log(error);
        displayError();
      }); // Error parsing JSON file
  });
});
