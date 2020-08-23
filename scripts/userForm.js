/*
Assignment: Chapter 6 Credit Card Payment App
Author: Peiyu Williamson
Date: 8/8/2020
Purpose: The functions stored here are checkUserForm to make sure all the values are typed, saveUserForm to save the values, showUserForm to display the values saved and submit function for user form */

/* 
 * Check the user form for valid values for input
 */
function checkUserForm() 
{
  //Check for empty fields in the form 
  //for finding current date
  var d = new Date();
  var month= d.getMonth() + 1;
  var date= d.getDate();
  var year= d.getFullYear();	
  var currentDate = year + '/' +
      ((''+month).length<2 ? '0' : '') + month + '/' +
      ((''+date).length<2 ? '0' : '') + date;
  var bi = new Date($("#datBirthdate").val());
  var age = Math.floor((d-bi)/ (365.25 * 24 * 60 * 60 * 1000));  
  
  if ($("#txtFirstName").val() == "") {
    alert("You need to enter your first name.");
    return false;
  } else if ($("#txtLastName").val() == "") {
    alert("You need to enter your last name.");
    return false;
  } else if ($("#datBirthdate").val() == "") {
    alert("You need to enter your birthdate");
    return false;
  } else if ($("#datBirthdate").val() > currentDate){
    alert("Your birthdate can't be in the future");
    return false;
  } else if (age<18){
    alert("You need to be 18 and above to use this app.");
    return false;
  } else if ($("#txtCreditLimit").val() == "") {
    alert("You need to enter your credit limit.");
    return false;
  } else if ($("#txtTotalBalance").val() == "") {
    alert("You need to enter your total balance.");
    return false;
  }	
    else {
    return true;
  }

}

/* 
 * Use checkUserForm to check form then procced to save 
 * when it is valid else alert user not valid
 */
function saveUserForm()
{
  if(checkUserForm())
  {
    var user = {
      "FirstName" : $("#txtFirstName").val(),
      "LastName"   : $("#txtLastName").val(),
      "NewPassword" : $("#changePassword").val(),
      "DOB" : $("#datBirthdate").val(),
      "CreditLimit" : $("#txtCreditLimit").val(),
      "TotalBalance" : $("#txtTotalBalance").val()	    
    };
  try
  {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Saving Information");
    $.mobile.changePage("#pageMenu");
  }
  catch(e)
  {
    /* 
     * Google browsers use different error
     * constant
     */
    if (window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds.");
      }	
    } 
    else if (e == QUOTA_EXCEEDED_ERR) 
    {
      alert("Error: Saving to local storage.");
    }     
    console.log(e);    
  }	  
  }
  else
  {
    alert("Please complete the form properly.");	
  }	
}

/* 
 * Get user from local storage 
 */
function showUserForm()
{
  //Load the stored value in the form
  try
  {
    var user=JSON.parse(localStorage.getItem("user"));	
  }
  catch(e)
  {
  /*
   * Google browsers use different error
   * constant
   */
    if (window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: Local Storage limit exceeds.");
      }   	    
    }
    else if (e == QUOTA_EXCEEDED_ERR)
    {
      alert("Error: Saving to local storage.");
    }
    console.log(e);	  
   }
   
   if(user != null)
   {
     $("#txtFirstName").val(user.FirstName);
     $("#txtLastName").val(user.LastName);
     $("#changePassword").val(user.NewPassword);
     $("#datBirthdate").val(user.DOB);
     $("#txtCreditLimit").val(user.CreditLimit);
     $("#txtTotalBalance").val(user.TotalBalance);	  
   }	
}

/*
 * Submit function for user form 
 */
$("#frmUserForm").submit(function() {
  //Event: submitting the form
  saveUserForm();
  return true;
});
