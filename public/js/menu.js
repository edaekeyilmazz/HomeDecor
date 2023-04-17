$(document).ready(function() {
    $('.hamburger').click(function() {
      $('.navbar-right').toggleClass('show');
      $(this).toggleClass('active');
    });
});