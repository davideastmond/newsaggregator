import { checkBoxSource } from "./partials/source-checkbox-item.js"
var masterList;
$(async () => {
  // Test get sources
  const { data } = await axios.get('/user/user/sources')
  const { allSources, userSources } = data
  console.log(allSources)
  console.log(userSources)

  loadNewsSourceList(allSources.sources)
  masterList = allSources.sources

  $('#sources-search-textbox-filter').on('keyup', () => {
    const filterString = $('#sources-search-textbox-filter').val().toLowerCase();
    const filteredSourcesList = masterList.filter((source) => {
      return source.name.toLowerCase().includes(filterString)
    })
    loadNewsSourceList(filteredSourcesList)
  })
})

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
