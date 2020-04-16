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
    url: "/api/favorites/" + id,
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
    url: "/api/favorites/" + id,
    data: {
      favorite: false,
    },
  }).then(function () {
    location.reload();
  });
});

$(".note").on("click", function () {
  var id = $(this).attr("data-id");
  console.log(id);
});
