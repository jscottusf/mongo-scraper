let modalId;
let name;
let body;

//helps bring icons to the front, so icons won't trigger an article click and open NPR
$('.icon').on('click', function (event) {
  event.preventDefault();
  var id = $(this).attr('id');
  console.log(id);
});

$('.x').on('click', function (event) {
  event.preventDefault();
  var id = $(this).attr('data-id').replace(/['"]+/g, '');
  console.log(id);
  $.ajax({
    method: 'DELETE',
    url: '/api/articles/' + id,
  }).then(function () {
    location.reload();
  });
});

//PUT article on favorites
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

//Unline article that's already been liked by clicking on dark heart
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

//open a modal which contains a form and all notes made on this article
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

//on modal, click add note, make a POST request adding comment to Mongoose
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

//empty modal should be emptied before rendering comment data so that it's unique to the article
function emptyModal() {
  $('#notes').empty();
}
