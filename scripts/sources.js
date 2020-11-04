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
    $('#source-option-global').prop('checked', true);
    $('.option-global').addClass('active');
    $('.option-off').removeClass('active');
    $('.option-topic').removeClass('active');
    $('.search-text-container').removeClass(['hide', 'half']);
    $('.sources-list-back-ground').removeClass(['hide', 'half']);
  });

  $('#source-option-off').on('click', (e) => {
    $('#source-option-off').prop('checked', true);
    $('.option-off').addClass('active');
    $('.option-global').removeClass('active');
    $('.option-topic').removeClass('active');
    $('.search-text-container').addClass('hide');
    $('.sources-list-back-ground').addClass('hide');
  });

  $('#source-option-topic').on('click', (e) => {
    $('#source-option-topic').prop('checked', true);
    $('.option-global').removeClass('active');
    $('.option-off').removeClass('active');
    $('.option-topic').addClass('active');
    $('.search-text-container').addClass('half').removeClass('hide');
    $('.sources-list-back-ground').removeClass('hide').addClass('half');
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
