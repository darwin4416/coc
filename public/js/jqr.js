$(document).ready(function(){
    $("#toggle-nav").click(function(){
          $(this).fadeOut();
          $(".main-nav").animate({width:"30%"});
          $(".nav-link").hide();
          $("#right-arrow").fadeIn().css({display:"block"});
      });
     $("#right-arrow").click(function(){
       $(".nav-link").fadeIn();
        $(".main-nav").animate({width:"100%"});
        
        $(this).css({display:"none"});
        $("#toggle-nav").fadeIn();
     }); 
     
     $(function () {
      $('#datetimepicker1').datetimepicker();
  }); 
  
  });