$(document).ready(function () {
    var body = document.querySelector("body");
    var navbar = document.querySelectorAll(".topnav > a, .menu-row > a");
    var changesize = document.querySelector("#font-size > option");
    
    var font_size = localStorage.getItem("font-size") ?? '20px';
    body.style.fontSize = font_size;
    changesize.style.fontSize = font_size;
    navbar.forEach(nav => {
        nav.style.fontSize = font_size;
    });

});


var dropdown = document.getElementById("font-size");
dropdown.addEventListener("change", function () {
    var body = document.querySelector("body");
    var navbar = document.querySelectorAll(".topnav > a, .menu-row > a");
  
    var selectedValue = dropdown.value;
    body.style.fontSize = selectedValue;
    navbar.forEach(nav => {
        nav.style.fontSize = selectedValue;
    });

    localStorage.setItem("font-size", selectedValue);
});
