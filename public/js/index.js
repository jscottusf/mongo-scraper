let modalId;
let name;
let body;

$('.icon').on('click', function (event) {
  event.preventDefault();
  var id = $(this).attr('id');
  console.log(id);
});

$('.like').on('click', function () {
  var id = $(this).attr('data-id').replace(/['"]+/g, '');
  console.log(id);
  $.ajax({
    method: 'PUT',
    url: '/api/articles/' + id,
    data: {
      favorite: true,
    },
  }).then(function () {
    location.reload();
  });
});

$('.unlike').on('click', function () {
  var id = $(this).attr('data-id').replace(/['"]+/g, '');
  console.log(id);
  $.ajax({
    method: 'PUT',
    url: '/api/articles/' + id,
    data: {
      favorite: false,
    },
  }).then(function () {
    location.reload();
  });
});

$('.note').on('click', function () {
  emptyModal();
  var id = $(this).attr('data-id').replace(/['"]+/g, '');
  modalId = id;
  console.log(id);
  $.ajax({
    method: 'GET',
    url: '/api/articles/' + id,
  }).then(function (results) {
    console.log(results);
    var notes = results.note;
    $('form-group').prepend();
    if (notes.length > 0) {
      for (var i = 0; i < notes.length; i++) {
        var nameDiv = $(
          "<div id='name'><i class='fas fa-user'></i> <strong>" +
            notes[i].name +
            '</strong> ' +
            notes[i].body +
            '</div>'
        );
        $('#notes').append(nameDiv);
      }
    } else {
      var noneDiv = $(
        "<p><i class='fas fa-user-slash'></i> no one has made any notes</p>"
      );
      $('#notes').append(noneDiv);
    }
  });
});

$('#add-note').on('click', function () {
  name = $('.name').val();
  body = $('#body').val().trim();
  $.ajax({
    method: 'POST',
    url: '/api/articles/' + modalId,
    data: {
      name: name,
      body: body,
    },
  }).then(function () {
    $('.name').val('');
    $('#body').val('');
    location.reload();
  });
});

function emptyModal() {
  $('#notes').empty();
}
