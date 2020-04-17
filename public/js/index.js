let modalId;
let name;
let body;

$(".icon").on("click", function (event) {
  event.preventDefault();
  var id = $(this).attr("id");
  console.log(id);
});

$(".like").on("click", function () {
  var id = $(this).attr("data-id").replace(/['"]+/g, "");
  console.log(id);
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + id,
    data: {
      favorite: true,
    },
  }).then(function () {
    location.reload();
  });
});

$(".unlike").on("click", function () {
  var id = $(this).attr("data-id").replace(/['"]+/g, "");
  console.log(id);
  $.ajax({
    method: "PUT",
    url: "/api/articles/" + id,
    data: {
      favorite: false,
    },
  }).then(function () {
    location.reload();
  });
});

$(".note").on("click", function () {
  emptyModal();
  var id = $(this).attr("data-id").replace(/['"]+/g, "");
  modalId = id;
  console.log(id);
  $.ajax({
    method: "GET",
    url: "/api/articles/" + id,
  }).then(function (results) {
    console.log(results);
    var notes = results.note;
    $("form-group").prepend();
    if (notes.length > 0) {
      for (var i = 0; i < notes.length; i++) {
        var nameDiv = $("<div id='name'>" + notes[i].name + "</div>");
        var noteDiv = $("<div id='note-body'>" + notes[i].body + "</div><hr>");
        $("#notes").append(nameDiv, noteDiv);
      }
    } else {
      var noneDiv = $("<p>no notes, yet. be the first to comment</p>");
      $("#notes").append(noneDiv);
    }
  });
});

$("#add-note").on("click", function () {
  name = $(".name").val();
  body = $("#body").val().trim();
  $.ajax({
    method: "POST",
    url: "/api/articles/" + modalId,
    data: {
      name: name,
      body: body,
    },
  }).then(function () {
    $(".name").val("");
    $("#body").val("");
  });
});

function emptyModal() {
  $("#notes").empty();
}
