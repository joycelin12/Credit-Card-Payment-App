/*
  Assignment: Chapter 6 Credit Card Payment App
  Author: Peiyu Williamson
  Date: 8/8/2020
  Purpose: The functions stored here are record related functions.
*/

/* 
 * Onclick function will removes the records from the localStorage, 
 * it calls the listRecords function, 
 * and alerts the user so they know all records have been deleted
 */
$("#btnClearHistory").click(function(){

   try
  {
    localStorage.removeItem("tbPurchaseRecords");
    localStorage.removeItem("tbPaymentRecords");
    listPurchaseRecords();
    listPaymentRecords();
    alert("All records are deleted.");	  

  }	
  catch(e)
  {
    /* 
     * Google browsers use different error
     * constant
     */
     if( window.navigator.vendor==="Google Inc.")
     {
       if(e == DOMException.QUOTA_EXCEEDED_ERR)
       {
         alert("Error: Local Storage limit exceeds.");
       }	     
     }
     else if(e == QUOTA_EXCEEDED_ERR) {
       alert("Error: Saving to local storage.");
     }	  
     console.log(e);	  
  }		
  
});

/* 
 * The value of the Submit Purchase Record button is used
 * to determine which operation should be performed
 */
$("#btnAddPurchaseRecord").click(function(){
  /* 
   * button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
   $("#btnSubmitPurchaseRecord").val("Add Purchase");
   	
   if ($("#btnSubmitPurchaseRecord").hasClass("ui-btn-hidden")) {
        
     $("#btnSubmitPurchaseRecord").button("refresh");
   }	
});

/* 
 * The value of the Submit Payment Record button is used
 * to determine which operation should be performed
 */
$("#btnAddPaymentRecord").click(function(){
  /* 
   * button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
   $("#btnSubmitPaymentRecord").val("Add Payment");
   if ($("#btnSubmitPaymentRecord").hasClass("ui-btn-hidden")) {
     $("#btnSubmitPaymentRecord").button("refresh");
   }	
});


/*
 * Submit function for the add purchase record 
 * button
 */
$("#frmNewPurchaseRecordForm").submit(function(){
  var formOperation=$("#btnSubmitPurchaseRecord").val();
  
  if(formOperation=="Add Purchase")
  {
    addPurchaseRecord();
    $.mobile.changePage("#pageRecords");
	  
  }
  else if(formOperation == "Edit Purchase")
  {
    editPurchaseRecord($("#btnSubmitPurchaseRecord").attr("indexToEditPurchase"));
    $.mobile.changePage("#pageRecords");
    $("#btnSubmitPurchaseRecord").removeAttr("indexToEditPurchase");
    	
  }

  /* 
   * Must return false, or else 
   * submitting form
   * results in reloading the page
   */
   return false;	
});

/* 
 * Submit function on add payment record 
 * button 
 */
$("#frmNewPaymentRecordForm").submit(function(){
  var formOperation=$("#btnSubmitPaymentRecord").val();
  
  if(formOperation=="Add Payment")
  {
    addPaymentRecord();
    $.mobile.changePage("#pageRecords");
	  
  }
  else if(formOperation == "Edit Payment")
  {
    editPaymentRecord($("#btnSubmitPaymentRecord").attr("indexToEditPayment"));
    $.mobile.changePage("#pageRecords");
    $("#btnSubmitPaymentRecord").removeAttr("indexToEditPayment");
    	
  }

  /*
   * Must return false, o else submitting form
   * results in reloading the page
   */
   return false;	
});

/* 
 * Page show function fo page new purchase record 
 * form 
 */
$("#pageNewPurchaseRecordForm").on("pageshow", function(){
  
  //We need to know if we are editing or adding a record everytime
  //we show this page
  //if we are adding a record we show the form with blank inputs
  var formOperation=$("#btnSubmitPurchaseRecord").val();
  
  if(formOperation=="Add Purchase")
  {
    clearPurchaseRecordForm();
  } 
  else if (formOperation=="Edit Purchase") 
  {
    //if we are editing a record we load the stored data in the form
    showPurchaseRecordForm($("#btnSubmitPurchaseRecord").attr("indexToEditPurchase"));
  }	
});

/* Page show function fo page new payment record 
 * form 
 */
$("#pageNewPaymentRecordForm").on("pageshow", function(){
  
  //We need to know if we are editing or adding a record everytime
  //we show this page
  //if we are adding a record we show the form with blank inputs
  var formOperation=$("#btnSubmitPaymentRecord").val();
  
  if(formOperation=="Add Payment")
  {
    clearPaymentRecordForm();
  } 
  else if (formOperation=="Edit Payment") 
  {
    //if we are editing a record we load the stored data in the form
    showPaymentRecordForm($("#btnSubmitPaymentRecord").attr("indexToEditPayment"));
  }	
});


/* 
 * Get user from local storage, if user exists, load
 * user summary.
 */
function loadUserInformation()
{
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
    else if(e == QUOTA_EXCEEDED_ERR) 
    {
      alert("Error: Saving to local storage.");
    }
    
    console.log(e);
  }

  if(user != null)
  {
    $("#divUserSection").empty();
    var today=new Date();
    var dob=new Date(user.DOB);
    var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));
  
    $("#divUserSection").append("User's Name: " +user.FirstName+" "
	  +user.LastName+"<br>Age: "+age+"<br>New Password: "+user.NewPassword+"<br>Credit Limit: "+user.CreditLimit+"<br>Total Balance: "+user.TotalBalance);
    $("#divUserSection").append("<br><a href='#pageUserInfo' data-mini='true'"+ 
	   "id='btnProfile' data-role='button' data-icon='edit' data-iconpos='left'"+
	   "data-inline='true' >Edit Profile</a>");
    $('#btnProfile').button(); // 'refresh the button'
  
  }
}

/* 
 * Clear all the inputs in the add new purchase 
 * record form 
 */
function clearPurchaseRecordForm() 
{
  $('#txtCreditCardName').val("");
  $('#slcSpendingType option[value=""]').attr('selected','selected');
  $('#slcSpendingType option:selected').val("");
  $('#slcSpendingType').selectmenu('refresh', true);
  $('#slcSpendingType').val("");	
  $('#txtSpendingAmount').val("");
  $('#datSpendingDate').val("");
  
  return true;	
}

/* 
 * Clear all the inputs in the add new payment 
 * record form 
 */
function clearPaymentRecordForm() 
{
  $('#txtPCreditCardName').val("");
  $('#txtPaymentAmount').val("");
  $('#datPaymentDate').val("");
  $('#datPaymentDueDate').val("");	
  return true;	
}

/* 
 * This function will help with sorting
 */
function compareDates(a, b)
{
  var x=new Date(a.Date);
  var y=new Date(b.Date);

  if(x>y)
  {
    return 1;
  } 
  else
  {
    return -1;
  }	
}

/* 
 * Get purchase records from local storage and JSON parse the data and alert
 * if failed. if there is records then sort using compareDates.
 * Set up the table with column headings and loop through records
 * with edit and delete button. if no records, then set empty array.
 */
function listPurchaseRecords()
{
  try
  {
    var tbPurchaseRecords=JSON.parse(localStorage.getItem("tbPurchaseRecords"));	
  }	
  catch(e)
  {
    /* 
     * Google browsers use different error
     * constant
     */
     if( window.navigator.vendor==="Google Inc.")
     {
       if(e == DOMException.QUOTA_EXCEEDED_ERR)
       {
         alert("Error: Local Storage limit exceeds.");
       }	     
     }
     else if(e == QUOTA_EXCEEDED_ERR) {
       alert("Error: Saving to local storage.");
     }	  
     console.log(e);	  
  }	
  
  //Load previous records, if they exist
  if(tbPurchaseRecords != null)
  {
     //Order the records by date
     
     //tbPurchaseRecords.sort(compareDates);
     //console.log(tbPurchaseRecords);
	  
 
    //Initializing the table
    $("#tblPurchaseRecords").html(
      "<thead>"+
      "  <tr>"+
      "  <th>Credit Card</th>"+	    
      "  <th>Purchase Date</th>"+
      "  <th>Spending Type</th>"+
      "  <th>Spending Amount</th>"+
      "  <th>Edit  /  Delete</th>"+
      " </tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>"	    
    );
    

    //Loop to insert the each record in the table
    for(var i=0; i<tbPurchaseRecords.length;i++)
    {
      	    
      var rec=tbPurchaseRecords[i];		    
      $("#tblPurchaseRecords tbody").append("<tr>"+
	      " <td>"+rec.CreditCard+"</td>" +
	      " <td>"+rec.SpendingDate+"</td>" +
	      " <td>"+rec.SpendingType+"</td>" +
	      " <td>"+rec.SpendingAmount+"</td>" +
	      " <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewPurchaseRecordForm' onclick='callEditPurchase("+i+")' data-icon='edit' data-iconpos='notext'></a>"+
	      " <a data-inline='true' data-mini='true' data-role='button' href='#' onclick='callDeletePurchase("+i+")' data-icon='delete' data-iconpos='notext'></a></td>"+
	      "</tr>");

    }
    $('#tblPurchaseRecords [data-role="button"]').button(); //'Refresh' the button.
	  //Without this the delete/edit button wont appear
  }
  else 
  {
    $("#tblPurchaseRecords").html("");

  }
  return true;	
}

/* 
 * Get payment records from local storage and JSON parse the data and alert
 * if failed. if there is records then sort using compareDates.
 * Set up the table with column headings and loop through records
 * with edit and delete button. if no records, then set empty array.
 */
function listPaymentRecords()
{
  try
  {
    var tbPaymentRecords=JSON.parse(localStorage.getItem("tbPaymentRecords"));	
  }	
  catch(e)
  {
    /* Google browsers use different error
     * constant
     */
     if( window.navigator.vendor==="Google Inc.")
     {
       if(e == DOMException.QUOTA_EXCEEDED_ERR)
       {
         alert("Error: Local Storage limit exceeds.");
       }	     
     }
     else if(e == QUOTA_EXCEEDED_ERR) {
       alert("Error: Saving to local storage.");
     }	  
     console.log(e);	  
  }	
  
  //Load previous records, if they exist
  if(tbPaymentRecords != null)
  {
    
    //Order the records by date
    //tbPaymentRecords.sort(compareDates);
	  
    //Initializing the table
    $("#tblPaymentRecords").html(
      "<thead>"+
      "  <tr>"+	
      "  <th>Credit Card</th>"+   	    
      "  <th>Payment Date</th>"+
      "  <th>Payment Amount</th>"+
      "  <th>Due Date</th>"+
      "  <th>Edit  /  Delete</th>"+
      " </tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>"	    
    );
    

    //Loop to insert the each record in the table
    for(var i=0; i<tbPaymentRecords.length;i++)
    {
      var rec=tbPaymentRecords[i];
      $("#tblPaymentRecords tbody").append("<tr>"+
	      " <td>"+rec.CreditCard+"</td>" +
	      " <td>"+rec.PaymentDate+"</td>" +
	      " <td>"+rec.PaymentAmount+"</td>" +
	      " <td>"+rec.PaymentDueDate+"</td>" +
	      " <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewPaymentRecordForm' onclick='callEditPayment("+i+")' data-icon='edit' data-iconpos='notext'></a>"+
	      " <a data-inline='true' data-mini='true' data-role='button' href='#' onclick='callDeletePayment("+i+")' data-icon='delete' data-iconpos='notext'></a></td>"+
	      "</tr>");

    }
    $('#tblPaymentRecords [data-role="button"]').button(); //'Refresh' the button.
	  //Without this the delete/edit button wont appear
  }
  else 
  {
    $("#tblPaymentRecords").html("");

  }
  return true;	
}

/* 
 * Get purchase records from local storage
 * and JSON parse them. Try to get them and
 * set index and alert if fail. 
 */
function showPurchaseRecordForm(index)
{
  try
  {
     var tbPurchaseRecords=JSON.parse(localStorage.getItem("tbPurchaseRecords"));
     var rec=tbPurchaseRecords[index];
     $('#txtCreditCardName').val(rec.CreditCard);
     $('#slcSpendingType option[value='+rec.SpendingType+']').attr('selected','selected');	  
     $('#slcSpendingType option:selected').val(rec.SpendingType);
     $('#slcSpendingType').selectmenu('refresh', true);
     $('#txtSpendingAmount').val(rec.SpendingAmount);
     $('#datSpendingDate').val(rec.SpendingDate);
        	  
     }	
  catch(e)
  {
    /* google browsers use different error
     * constant
     */
    if(window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: local storage limit exceeds.");
      }	    
    }
    else if(e == QUOTA_EXCEEDED_ERR) 
    {
      alert("Error: Saving to local storage.");

    }	  
    console.log(e);	  
  }	
}

/* 
 * Get payment records from local storage
 * and JSON parse them. Try to get them and
 * set index and alert if fail. 
 */
function showPaymentRecordForm(index)
{
  try
  {
     var tbPaymentRecords=JSON.parse(localStorage.getItem("tbPaymentRecords"));
     var rec=tbPaymentRecords[index];
     $('#txtPCreditCardName').val(rec.CreditCard);
     $('#txtPaymentAmount').val(rec.PaymentAmount);
     $('#datPaymentDate').val(rec.PaymentDate);
     $('#datPaymentDueDate').val(rec.PaymentDueDate);	

	  
  }	
  catch(e)
  {
    /* google browsers use different error
     * constant
     */
    if(window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR)
      {
        alert("Error: local storage limit exceeds.");
      }	    
    }
    else if(e == QUOTA_EXCEEDED_ERR) 
    {
      alert("Error: Saving to local storage.");

    }	  
    console.log(e);	  
  }	
}

/* 
 * Checks that users have entered all valid info
 * for purchase and that the date they entered 
 * is not in the future
 */
function checkPurchaseRecordForm()
{
  //for finding current date
  var d=new Date();
  var month=d.getMonth() +1;
  var date=d.getDate();
  var year=d.getFullYear();	
  var currentDate = year + '/' +
		((''+month).length<2 ? '0' : '') + month + '/' +
		((''+date).length<2 ? '0' : '') + date;
  	

  if(($("#txtCreditCardName").val() != "") &&
     ($("#slcSpendingType option:selected").val() != "Select Spending Type") &&
     ($("#txtSpendingAmount").val() != "") &&
     ($("#datSpendingDate").val() != "") && ($("#datSpendingDate").val() <= currentDate))
  {
    return true;
  }
  else 
  {
    return false;
  }
}

/* 
 * Checks that users have entered all valid info for
 * payment and that the date they entered 
 * is not in the future.
 */
function checkPaymentRecordForm()
{
  //for finding current date
  var d=new Date();
  var month=d.getMonth() +1;
  var date=d.getDate();
  var year=d.getFullYear();	
  var currentDate = year + '/' +
		((''+month).length<2 ? '0' : '') + month + '/' +
		((''+date).length<2 ? '0' : '') + date;

  if(($("#txtPCreditCardName").val() != "") &&
     ($("#txtPaymentAmount").val() != "") &&
     ($("#datPaymentDate").val() != "") && ($("#datPaymentDate").val() 
	     <= currentDate) &&
      ($("#datPaymentDueDate").val() != ""))
  {
     
    return true;
  }
  else 
  {
     	  
    return false;
  }	
}

/* 
 * Set indexToEdit in Purchase to given index and set value of
 * button to Edit and refresh the button
 */
function callEditPurchase(index) 
{
  $("#btnSubmitPurchaseRecord").attr("indexToEditPurchase", index);
  /*.button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
  $("#btnSubmitPurchaseRecord").val("Edit Purchase");
  
  if ($("#btnSubmitPurchaseRecord").hasClass("ui-btn-hidden")) {
    	  
    $("#btnSubmitPurchaseRecord").button("refresh");	
  }	
}

/* 
 * Set indexToEdit in Payment to given index and set value of
 * button to Edit and refresh the button
 */
function callEditPayment(index) 
{
  	
  $("#btnSubmitPaymentRecord").attr("indexToEditPayment", index);
  /*.button("refresh") function forces jQuery
   * Mobile to refresh the text on the button
   */
  $("#btnSubmitPaymentRecord").val("Edit Payment");
  
  if($("#btnSubmitPaymentRecord").hasClass("ui-btn-hidden")) {
    $("#btnSubmitPaymentRecord").button("refresh");	
  }	
}

/* Delete the given index in purchase 
 * and re-display the table
 */
function callDeletePurchase(index)
{
  deletePurchaseRecord(index);
  listPurchaseRecords();
}

/*
 * Delete the given index in payment 
 * and re-display the table
 */
function callDeletePayment(index)
{
  deletePaymentRecord(index);
  listPaymentRecords();
}

/* 
 * If checkRecordForm is true, create JSON on form info
 * Get current purchase records and JSON parse
 * If null, make it empty and add JSON then sort and
 * save to local storage.
 */
function addPurchaseRecord()
{
  if(checkPurchaseRecordForm())
  {
    var record={
      "CreditCard" : $('#txtCreditCardName').val(),
      "SpendingType"  : $('#slcSpendingType option:selected').val(),
      "SpendingAmount"   : $('#txtSpendingAmount').val(),
      "SpendingDate" : $('#datSpendingDate').val()
      		    
    };

    try
    {
      var tbPurchaseRecords=JSON.parse(localStorage.getItem("tbPurchaseRecords"));
      if(tbPurchaseRecords == null)
      {
        tbPurchaseRecords = [];

      } 	    
      tbPurchaseRecords.push(record);
      tbPurchaseRecords.sort(compareDates);
      localStorage.setItem("tbPurchaseRecords", JSON.stringify(tbPurchaseRecords));
      alert("Saving Information");
      clearPurchaseRecordForm();
      listPurchaseRecords();
    }
    catch(e)
    {
      /*Google browsers use different error
       * constant
       */
      if (window.navigator.vendor === "Google Inc.")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
	{
          alert("Error: Local Storage limit exceeds.");
	}      
      } 
      else if(e == QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
      console.log(e);	    
    }	  
  }
  else
  {
    alert("Please complete the form properly.");
  }	
  return true;	
}

/* 
 * If checkRecordForm is true, create JSON on form info
 * Get current payment records and JSON parse
 * If null, make it empty and add JSON then sort and
 * save to local storage.
 */
function addPaymentRecord()
{
  if(checkPaymentRecordForm())
  {
    var record={
      "CreditCard" : $('#txtPCreditCardName').val(),
      "PaymentAmount"   : $('#txtPaymentAmount').val(),
      "PaymentDate" : $('#datPaymentDate').val(),
      "PaymentDueDate" : $('#datPaymentDueDate').val()	    
      	    
    };

    try
    {
      var tbPaymentRecords=JSON.parse(localStorage.getItem("tbPaymentRecords"));
      if(tbPaymentRecords == null)
      {
        tbPaymentRecords = [];

      } 
      tbPaymentRecords.push(record);
      tbPaymentRecords.sort(compareDates);
      tbPaymentRecords.sort(compareDates);
	    
      localStorage.setItem("tbPaymentRecords", JSON.stringify(tbPaymentRecords));
      alert("Saving Information");
      clearPaymentRecordForm();
      listPaymentRecords();
    }
    catch(e)
    {
      /*Google browsers use different error
       * constant
       */
      if (window.navigator.vendor === "Google Inc.")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
	{
          alert("Error: Local Storage limit exceeds.");
	}      
      } 
      else if(e == QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
      console.log(e);	    
    }	  
  }
  else
  {
    alert("Please complete the form properly.");
  }	
  return true;	
}

/* 
 * Get purchase records from local storage and JSON parse
 * splice at the index, if length is 0, remove from local 
 * storage else save to local storage
 */
function deletePurchaseRecord(index)
{
  try
  {
    var tbPurchaseRecords=JSON.parse(localStorage.getItem("tbPurchaseRecords"));
    
    tbPurchaseRecords.splice(index,1);

    if(tbPurchaseRecords.length==0)
    {
      /* No items left in records, remove entire
       * array from localStorage
       */
      localStorage.removeItem("tbPurchaseRecords");

    }
    else
    {
      localStorage.setItem("tbPurchaseRecords", JSON.stringify(tbPurchaseRecords));
    }	  
  }
  catch(e)
  {
    /* Google browsers use different error
     * constant
     */
    if (window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR) 
      {
        alert("Error: Local Storage limit exceeds.");
      }	    
    }
    else if(e == QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }
    console.log(e);	  
  }

}

/* 
 * Get payment records from local storage and JSON parse
 * splice at the index, if length is 0, remove from local 
 * storage else save to local storage
 */
function deletePaymentRecord(index)
{
  try
  {
    var tbPaymentRecords=JSON.parse(localStorage.getItem("tbPaymentRecords"));
    
    tbPaymentRecords.splice(index,1);

    if(tbPaymentRecords.length==0)
    {
      /* No items left in records, remove entire
       * array from localStorage
       */
      localStorage.removeItem("tbPaymentRecords");

    }
    else
    {
      localStorage.setItem("tbPaymentRecords", JSON.stringify(tbPaymentRecords));
    }	  
  }
  catch(e)
  {
    /* Google browsers use different error
     * constant
     */
    if (window.navigator.vendor ==="Google Inc.")
    {
      if(e == DOMException.QUOTA_EXCEEDED_ERR) 
      {
        alert("Error: Local Storage limit exceeds.");
      }	    
    }
    else if(e == QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }
    console.log(e);	  
  }

}

/* 
 * If CheckRecordForm is true, get purchase records and
 * JSON parse then set record at given index then sort
 * and save.
 */
function editPurchaseRecord(index)
{
  if(checkPurchaseRecordForm())
  {
    
    try
    {
      var tbPurchaseRecords=JSON.parse(localStorage.getItem("tbPurchaseRecords"));
      tbPurchaseRecords[index] ={
         "CreditCard" : $('#txtCreditCardName').val(),
         "SpendingType"  : $('#slcSpendingType').val(),
         "SpendingAmount"   : $('#txtSpendingAmount').val(),
         "SpendingDate" : $('#datSpendingDate').val()
        
         
      }; //Alter the selected item in the array
      tbPurchaseRecords.sort(compareDates);	    
      localStorage.setItem("tbPurchaseRecords", JSON.stringify(tbPurchaseRecords));
      alert("Saving Information");
      clearPurchaseRecordForm();
      listPurchaseRecords();
    }
    catch(e)
    {
      /*Google browsers use different error
       * constant
       */
      if (window.navigator.vendor === "Google Inc.")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
	{
          alert("Error: Local Storage limit exceeds.");
	}      
      } 
      else if(e == QUOTA_EXCEEDED_ERR) {
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
 * If CheckRecordForm is true, get payment records and
 * JSON parse then set record at given index then sort
 * and save.
 */
function editPaymentRecord(index)
{
  if(checkPaymentRecordForm())
  {
    
    try
    {
      var tbPaymentRecords=JSON.parse(localStorage.getItem("tbPaymentRecords"));
      tbPaymentRecords[index] ={
         "CreditCard" : $('#txtPCreditCardName').val(),
         "PaymentDate" : $('#datPaymentDate').val(),
	 "PaymentAmount"   : $('#txtPaymentAmount').val(),
	 "PaymentDueDate" : $('#datPaymentDueDate').val()	     
         
      }; //Alter the selected item in the array
      localStorage.setItem("tbPaymentRecords", JSON.stringify(tbPaymentRecords));
      alert("Saving Information");
      clearPaymentRecordForm();
      listPaymentRecords();
    }
    catch(e)
    {
      /*Google browsers use different error
       * constant
       */
      if (window.navigator.vendor === "Google Inc.")
      {
        if(e == DOMException.QUOTA_EXCEEDED_ERR)
	{
          alert("Error: Local Storage limit exceeds.");
	}      
      } 
      else if(e == QUOTA_EXCEEDED_ERR) {
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
