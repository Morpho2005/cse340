const nameForm = document.querySelector("#updateName")
const passForm = document.querySelector("#updatePassword")

    nameForm.addEventListener("change", function () {
      const updateBtn = document.querySelector("#submitName")
      updateBtn.removeAttribute("disabled")
    })

    passForm.addEventListener("change", function () {
      const updateBtn = document.querySelector("#submitPass")
      updateBtn.removeAttribute("disabled")
    })