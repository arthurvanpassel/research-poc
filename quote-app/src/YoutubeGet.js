var axios = require('axios');

var ROOT_URL = 'https://www.googleapis.com/youtube/v3/search';

module.exports = function (options, callback) {
  if (!options.key) {
    throw new Error('Youtube Search expected key, received undefined');
  }

  if(options.type === 'video') {
    ROOT_URL = 'https://www.googleapis.com/youtube/v3/search';

    var params = {
        part: 'snippet',
        key: options.key,
        q: options.term,
        type: 'video',
        maxResults: options.maxResults,
      };

      axios.get(ROOT_URL, { params: params })
    .then(function(response) {
      if (callback) { callback(response.data.items); }
    })
    .catch(function(error) {
      console.error(error);
    });
  }

  if (options.type === 'caption') {
    ROOT_URL = 'https://video.google.com/timedtext?lang=en&id=0&v='+options.id;

    axios.post(ROOT_URL)
    .then(function(response) {
      if (callback) { callback(response.data); }
    })
    .catch(function(error) {
      console.error(error);
    });
  }

  
};
