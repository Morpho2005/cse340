 'use strict' 
 
 // Get a list of items in inventory based on the classification_id 
 let classificationList = document.querySelector("#classificationList")
 classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/type/"+classification_id;
  const classLink = document.querySelector('#classLink');
  classLink.href = classIdURL;
  const classButton = document.querySelector("#classButton");
  classButton.removeAttribute("disabled")
 })