// add an event listener to the shorten button for when the user clicks it
$('.btn-shorten').on('click', function(){
  // AJAX call to /api/shorten with the URL that the user entered in the input box
  $.ajax({
    url: '/api/short',
    type: 'GET',
    dataType: 'JSON',
    data: {
      appId: '595a2470c58cfa32809b4ec1',
      url: $('#url-field').val()
    },
    success: function(data){
        // display the shortened URL to the user that is returned by the server
        var resultHTML = '<a class="result" href="' + data.data.url + '">'
            + data.data.url + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    },
    error: function(res) {
      var resultHTML = '<div class="error">'
          + res.responseJSON.code + ' : ' + res.responseJSON.msg + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    }
  });
});