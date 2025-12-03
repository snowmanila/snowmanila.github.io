var url = 'https://producerplayer.services.pbskids.org/show-list/?shows=';
searchService();

// Fetch JSON data from the URL
// Dev Note: CORS error with content services page, but not with producer player/show page
// Dev Note: Navigate through each page, add '&page={i}' to URL
async function searchService() {
  fetch('https://cors-anywhere.com/https://content.services.pbskids.org/v2/kidspbsorg/home/')
  .then(r => r.json())
  .then(data => {
    for (collection in data.collections) {
      for (program in data.collections[collection]['content']) {
        if ("slug" in data.collections[collection]['content'][program]) {
          searchShow(data.collections[collection]['content'][program]['slug'], data.collections[collection]['content'][program]['images']['mezzanine_16x9'], 1);
        }
      }
    }
  })
  .catch(error => console.log('Error fetching data:', error));
}

async function searchShow(show, originImage, index) {
  console.log(show);
  fetch(url + show + "&page=" + index)
  .then(response => response.json()) 
  .then(data => {
    var premiereDate = 0;
    var encoreDate = 0;
    var currentDate = 0;
    var allContainer = document.getElementById("all");
    for (ep in data.items) {
      value = data.items[ep];
      const premiereDate = new Date(value['premiered_on']).getTime();
      const encoreDate = new Date(value['encored_on']).getTime();
      const currentDate = new Date().getTime();
      if (premiereDate >= currentDate) {
        var testCon = document.createElement('div');
        var indContainer = document.getElementById("episodes");
        testCon.setAttribute('class', 'flex-container');
        testCon.setAttribute('startValue', premiereDate);
        if (value['type'] == 'Episode') {
          testCon.innerHTML = '<div class="show"><img src="' + originImage + '" alt="' + show + '" style="width:250px;"></div><div class="episode"><details><summary>' + value['title'] + ' (' + value['nola_episode'] + ')</summary>' + value['description_long'] + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details>Releases on: ' + value['availabledate'] + ', expires on: ' + value['expirationdate'] + '</div>';
        } else {
          var indContainer = document.getElementById("clips");
          testCon.innerHTML = '<div class="show"><img src="' + originImage + '" alt="' + show + '" style="width:250px;"></div><div class="clip"><details><summary>' + value['title'] + ' (' + value['nola_episode'] + ')</summary>' + value['description_long'] + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details>Releases on: ' + value['availabledate'] + ', expires on: ' + value['expirationdate'] + '</div>';
        }
        indContainer.appendChild(testCon);
      } else if (encoreDate >= currentDate) {
        var testCon = document.createElement('div');
        var indContainer = document.getElementById("reruns");
        testCon.setAttribute('class', 'flex-container');
        testCon.setAttribute('startValue', encoreDate);
        testCon.innerHTML = '<div class="show"><img src="' + originImage + '" alt="' + show + '" style="width:250px;"></div><div class="rerun"><details><summary>' + value['title'] + ' (' + value['nola_episode'] + ')</summary>' + value['description_long'] + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details>Originally released on: ' + value['premiered_on'] + '<br>Releases on: ' + value['availabledate'] + ', expires on: ' + value['expirationdate'] + '</div>';
        indContainer.appendChild(testCon);
      }
    }
    if ((data.matched - (25*index) > 0) && ((premiereDate >= currentDate) || (encoreDate >= currentDate))) {
      searchShow(show, originImage, index+1);
    }
  })
  .catch(error => console.log('Error fetching data:', error));
}
