function deleteHandler(button) {
  console.log("Hello ");
  console.log("main container", button.parentNode.parentNode.parentNode);
  const currentCotainer = button.parentNode.parentNode;
  console.log("child container", currentCotainer);
  const inputs = button.parentNode.querySelectorAll("input");
  const [csrfToken, prodId] = inputs;
  // console.log('CSRF TOKEN', csrfToken.value)
  console.log("PROD ID", prodId.value);
  fetch("/admin/delete/" + prodId.value, {
    method: "DELETE",
    headers: {
      csrfToken: csrfToken.value,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log("res", res);
      currentCotainer.parentNode.removeChild(currentCotainer);
    })
    .catch((err) => {
      console.log("error in fetch", err);
    });
}
