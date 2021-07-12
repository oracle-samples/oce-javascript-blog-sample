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
   * @param {object} client - The client to connect to CEC with
   * @param {string} logoID - The identifier of the company logo's digital asset
   *
   */
  function populateHeaderImage(client, logoID) {
    // create header
    services
      .getRenditionURL(client, logoID)
      .then((url) => {
        utils.getImageUrl(url)
          .then((formattedUrl) => {
            $('#company-thumbnail')
              .attr('src', `${formattedUrl}`)
              .attr('alt', 'Company Logo');
          });
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
    const div = $('<div>')
      .attr('class', 'button-wrapper')
      .appendTo(parentContainer);
    $('<div />').attr('class', 'button').text(text).appendTo(div);
  }

  /**
   * Create and populate the <img> used to represent the thumbnail of the topic
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {object} client - The client to connect to CEC with
   * @param {object} parentContainer - The DOM element into which the list of topics will render
   * @param {string} thumbnailIdentifier - The identifier of the thumbnail to display
   *
   */
  function appendTopicThumbnail(
    client,
    parentContainer,
    thumbnailIdentifier,
  ) {
    const imgElement = $('<img />').appendTo(parentContainer);
    services
      .getMediumRenditionURL(client, thumbnailIdentifier)
      .then((url) => {
        utils.getImageUrl(url)
          .then((formattedUrl) => {
            imgElement.attr('src', formattedUrl);
          });
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
    const div = $('<div>')
      .attr('class', 'desc-wrapper')
      .appendTo(parentContainer);
    $('<div />').attr('class', 'description').text(detailText).appendTo(div);
  }

  /**
   * Given a collection of topic identifiers, fetch information about each one so that the topic
   * listing can be rendered on the home page.
   *
   * For tutorial purposes only, any errors are simply logged to the console
   *
   * @returns none
   * @param {object} client - The client to connect to CEC with
   * @param {[string]} topics - A collection of identifiers representing the topics to display
   * @param {object} container - The DOM element into which the topic should be rendered.
   *
   */
  function populateTopicListing(client, topicIdentifiers, container) {
    // Fetch information about each topic so that we can display all of the detail information
    // about the topic
    topicIdentifiers.forEach((id) => {
      // Create the DOM element that will contain a single topic
      const topicContainer = $('<div />')
        .attr({ class: 'topic' })
        .appendTo(container);

      // fetch the topic
      services.fetchTopic(client, id)
        .then((topic) => {
          // assign a click event on the topic container
          topicContainer.click(() => {
            window.location.href = `./articles.html?topicName=${encodeURIComponent(
              topic.name,
            )}&topicId=${encodeURIComponent(topic.id)}`;
          });
          appendTopicTitle(topicContainer, topic.name);
          appendTopicThumbnail(
            client,
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
    // Get the server configuration from the "content.json" file
    serverUtils.getClient
      .then((client) => {
        // get the top level topics
        services.fetchHomePage(client)
          .then((topLevelItem) => {
            $('#spinner').hide();
            populateHeaderTitle(topLevelItem.title);
            populateHeaderImage(client, topLevelItem.logoID);
            populateHeaderUrls(topLevelItem.aboutUrl, topLevelItem.contactUrl);

            const container = $('#topics');
            const topicIdentifiers = topLevelItem.topics.map(
              (topic) => topic.id,
            );
            populateTopicListing(client, topicIdentifiers, container);
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
