$(document).ready(function(){
  var body = document.querySelector("body");
  var font_size = localStorage.getItem("font-size");
  body.style.fontSize = font_size;
});


var dropdown = document.getElementById("font-size");
dropdown.addEventListener("change", function() {
    var body = document.querySelector("body");
    // var navbar = document.querySelector(".topnav");
    var navbar = document.querySelectorAll(".topnav > a");
  var selectedValue = dropdown.value;
  body.style.fontSize = selectedValue;
  navbar.forEach( nav =>{
      nav.style.fontSize = selectedValue;
  });
  
  localStorage.setItem("font-size", selectedValue);
});