searchService();

// Fetch JSON data from the URL
// Dev Note: CORS error with content services page, but not with producer player/show page
// Dev Note: Navigate through each page, add '&page={i}' to URL
var url = 'https://producerplayer.services.pbskids.org/show-list/?shows=';
async function searchService() {
  fetch('https://cors-anywhere.com/https://content.services.pbskids.org/v2/kidspbsorg/home/')
  .then(r => r.json())
  .then(data => {
    for (collection in data.collections) {
      for (program in data.collections[collection]['content']) {
        if ("slug" in data.collections[collection]['content'][program]) {
          searchShow(data.collections[collection]['content'][program]['slug'], data.collections[collection]['content'][program]['images']['mezzanine_16x9'])
        }
      }
    }
  })
  .catch(error => console.log('Error fetching data:', error));
}

async function searchShow(show, originImage) {
  var index = 1
  fetch(url + show + "&page=" + index)
  .then(response => response.json()) 
  .then(data => {
    for (ep in data.items) {
      value = data.items[ep]
      const premiereDate = new Date(value['premiered_on']).getTime();
      const currentDate = new Date().getTime();
      if (premiereDate >= currentDate) {
        var testCon = document.createElement('div')
        testCon.setAttribute('class', 'flex-container');
        if (value['type'] == 'Episode') {
          testCon.innerHTML = '<div class="show"><img src="' + originImage + '" alt="alternatetext" style="width:250px;"></div><div class="episode"><details><summary>' + value['title'] + ' (' + value['nola_episode'] + ')</summary>' + value['description_long'] + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details>Releases on: ' + value['availabledate'] + ', expires on: ' + value['expirationdate'] + '</div>';
        } else {
          testCon.innerHTML = '<div class="show"><img src="' + originImage + '" alt="alternatetext" style="width:250px;"></div><div class="clip"><details><summary>' + value['title'] + ' (' + value['nola_episode'] + ')</summary>' + value['description_long'] + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details>Releases on: ' + value['availabledate'] + ', expires on: ' + value['expirationdate'] + '</div>';
        }
        document.body.appendChild(testCon);
      }
      index = Math.ceil(data['matched'] / 25)
    }
    if (index != 1) {
      for (i = 2; i <= index; i++) {
        morePages(i)
      }
    }
  })
  .catch(error => console.log('Error fetching data:', error));
}

async function morePages(index, originImage) {
  fetch(url + "&page=" + index)
  .then(response => response.json())
  .then(data => {
    for (ep in data.items) {
      value = data.items[ep]
      const premiereDate = new Date(value['premiered_on']).getTime();
      const currentDate = new Date().getTime();
      if (premiereDate >= currentDate) {
        var testCon = document.createElement('div')
        testCon.setAttribute('class', 'flex-container');
        testCond.innerHTML = '<div class="show"><img src="' + originImage + '" alt="alternatetext" style="width:250px;"></div><div class="episode"><details><summary>[] (' + value['nola_episode'] + ')</summary>' + value['description_long'] + + '<br><img src="' + value['images']['kids-mezzannine-16x9']['url'] + '" alt="alternatetext" style="width:250px;"></details><br>Releases on: ' + value['premiered_on'] + ', expires on: ' + value['expirationdate'] + '</div>';
        document.body.appendChild(testCon);
      }
      index = Math.ceil(data['matched'] / 25)
    }
  })
  .catch(error => console.log('Error fetching data:', error));    
}