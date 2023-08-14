// function addProduct(btn) {
//   const formData = new FormData();
//   const b = btn;
//   // console.log("add product", b.parentNode.parentNode);
//   const formNode = b.parentNode.parentNode;
//   const [title, imageUrl, price] = formNode.querySelectorAll("input");
//   const description = formNode.querySelector("textarea");
//   formData.append(title.name, title.value);
//   console.log("file data", imageUrl.name, imageUrl.files[0]);
//   formData.append(imageUrl.name, imageUrl.files[0]);
//   formData.append(price.name, price.value);
//   formData.append(description.name, description.value);
//   // console.log("FORM DATA OBJECT", Object.fromEntries(formData));
//   const finalFormData = Object.fromEntries(formData);
//   console.log("FORM DATA", finalFormData);
//   fetch("/admin/add-product", {
//     method: "POST",
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//     body: finalFormData,
//   })
//     .then((res) => {
//       return res.json();
//     })
//     .then((res) => {
//       // errorMessage.innerText = res;
//       console.log("res", res);
//       // window.location = "/products";
//     })
//     .catch((err) => {
//       console.log("error", err.message);
//     });
// }

document.addEventListener("DOMContentLoaded", function () {
  // Your code here
  document
    .getElementById("myForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      // ...

      const formData = new FormData();
      const title = document.getElementById("title").value;
      console.log("TITLE", title);
      formData.append("title", title);

      const imageUrl = document.getElementById("imageUrl");
      console.log("FILE", imageUrl);

      const price = document.getElementById("price").value;
      console.log("PRICE", price);
      formData.append("price", price);

      const description = document.getElementById("description").value;
      console.log("DESCRIPTION", description);
      formData.append("description", description);

      if (imageUrl.files.length > 0) {
        const file = imageUrl.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          formData.append("file", event.target.result);
          const finalFormDat = Object.fromEntries(formData);
          fetch("/admin/add-product", {
            method: "POST",
            body: formData,
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log("res", res);
            })
            .catch((err) => {
              console.log(err);
            });
        };
        reader.readAsDataURL(file);
      }
    });
});
