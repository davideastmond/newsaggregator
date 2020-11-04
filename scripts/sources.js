import { checkBoxSource } from './partials/source-checkbox-item.js';
let masterList;
$(async () => {
  // Test get sources
  const { data } = await axios.get('/user/user/sources');
  const { allSources, userSources } = data;
  console.log(allSources);
  console.log(userSources);

  loadNewsSourceList(allSources.sources);
  masterList = allSources.sources;

  $('#sources-search-textbox-filter').on('keyup', () => {
    const filterString = $('#sources-search-textbox-filter').val().toLowerCase();
    const filteredSourcesList = masterList.filter((source) => {
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
});

/**
 *
 * @param {[{}]} sourceArray
 */
function loadNewsSourceList(sourceArray) {
  $('.ul-sources-list').empty();
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
