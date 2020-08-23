/*
  Assignment: Chapter 6 Credit Card Payment App
  Author: Peiyu Williamson
  Date: 8/15/2020
  Purpose: The functions stored here are pageshow events to call a function where
   if user info is active, it calls showUserFunction and if records page is active, 
   it calls loadUserInformation and listRecords
*/

/* runs the function to display the user information, history, graph or
* suggestions, every time their div is shown
*/
$(document).on("pageshow", function()
{
  if($('.ui-page-active').attr('id')=="pageUserInfo")
  {
    showUserForm();
  }
  else if($('.ui-page-active').attr('id')=="pageRecords")
  {
    loadUserInformation();
    listPurchaseRecords();
    listPaymentRecords();	  
  }
  else if($('.ui-page-active').attr('id')=="pageAdvice")
  {
    showAdvice();
    resizeGraph();	  
  }
  else if($('.ui-page-active').attr('id')=="pageGraph")
  {
    showGraph();
    resizeGraph();	  
  }	
});

/*
  resizeGraph will check if the width of the window is less than 700px.  If it
  is then it will change the width of the advice canvas and graph canvas to be
  50px smaller than the window width
*/
function resizeGraph() {
  if ($(window).width() < 700) {
    $("#AdviceCanvas").css({"width": $(window).width() - 50});
    $("#GraphCanvas").css({"width": $(window).width() - 50});
  }
}
