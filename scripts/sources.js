import { checkBoxSource } from './partials/source-checkbox-item.js';
import { topicDropDownItem } from './partials/topic-dropdow-item.js';
let masterSourcesList;
let masterTopicsList;

$(async () => {
  let allSources;
  // eslint-disable-next-line no-unused-vars
  let userSources;
  try {
    const data = await getSourcesAndTopicsFromAPI(
        ['/user/data/user/sources', '/user/data/user/topics']);

    ({ allSources, userSources } = data[0].data);
    masterSourcesList = allSources.sources;
    masterTopicsList = data[1].data.topics;

    console.log(masterSourcesList, masterTopicsList);
    loadNewsSourceList(masterSourcesList);
    loadTopicsIntoDropdown(masterTopicsList);
  } catch (exception) {
    console.log(exception);
    window.location.href = '/';
  }

  $('#sources-search-textbox-filter').on('keyup', () => {
    const filterString = $('#sources-search-textbox-filter').val().toLowerCase();
    const filteredSourcesList = masterSourcesList.filter((source) => {
      return source.name.toLowerCase().includes(filterString);
    });
    loadNewsSourceList(filteredSourcesList);
  });

  $('#source-option-global').on('click', (e) => {
    globalClicked();
  });

  $('#source-option-off').on('click', (e) => {
    offClicked();
  });

  $('#source-option-topic').on('click', (e) => {
    sourcesByTopicClicked();
  });

  $('#topicsSelect').on('change', ()=> {
    console.log('changed!');
  });
});

/**
 *
 * @param {[{}]} sourceArray
 */
function loadNewsSourceList(sourceArray) {
  // $('.ul-sources-list').empty();
  $('.ul-sources-list').html(sourceArray.map((source) => {
    return {
      cbValue: source.name,
      cbId: source.id,
      cbLabel: source.name,
      cbChecked: null,
    };
  }).map(checkBoxSource).join(''));
}

/**
 *
 * @param {[{}]} topicArray array of topic objects ({email, name})
 */
function loadTopicsIntoDropdown(topicArray) {
  $('#topicsSelect').empty();
  $('#topicsSelect').html(topicArray.map((topic) => {
    console.log(topic.name);
    return {
      topicItemCaption: topic.name,
    };
  }).map(topicDropDownItem).join(''));
}

/**
 * When the global sources button is clicked
 */
function globalClicked() {
  $('#source-option-global').prop('checked', true);
  $('.option-global').addClass('active');
  $('.option-off').removeClass('active');
  $('.option-topic').removeClass('active');
  $('.search-text-container').removeClass(['hide', 'half']);
  $('.sources-list-back-ground').removeClass(['hide', 'half']).addClass('full');
  $('.topics-container').addClass('hide');
}

/**
 * When the off button is clicked
 */
function offClicked() {
  $('#source-option-off').prop('checked', true);
  $('.option-off').addClass('active');
  $('.option-global').removeClass('active');
  $('.option-topic').removeClass('active');
  $('.search-text-container').addClass('hide');
  $('.sources-list-back-ground').addClass('hide');
  $('.topics-container').addClass('hide');
}

/**
 * Sources by topic button is clicked
 */
function sourcesByTopicClicked() {
  $('#source-option-topic').prop('checked', true);
  $('.option-global').removeClass('active');
  $('.option-off').removeClass('active');
  $('.option-topic').addClass('active');
  $('.search-text-container').addClass('half').removeClass('hide');
  $('.sources-list-back-ground').removeClass('hide').addClass('half');
  $('.topics-container').removeClass('hide').addClass('half');
}

/**
 *  @param {[]} requests Array of requests
 */
async function getSourcesAndTopicsFromAPI(requests) {
  return Promise.all(requests.map((request) => {
    return axios.get(request);
  }));
}
