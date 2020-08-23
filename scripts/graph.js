/*
  Assignment: Credit Card Payment App
  Author: Peiyu Williamson
  Date: 8/21/2020
  Purpose: To provide the functionality of creating a graph of my data overtime
    based on the data in local storage.
*/

/*
  showGraph will try to get the tbPurchaseRecords and tbPaymentRecords 
  from localStorage.  If there are no records, then it will alert the user
  and return to the menu page. Otherwise, it will set-up the canvas and 
  draw a line graph showing the Amount owed over time in the records and 
  lines for the lower and upper bound of the credit limit.
*/
function showGraph() {
  try {
    var tbPurchaseRecords = JSON.parse(localStorage.getItem("tbPurchaseRecords"));
    var tbPaymentRecords = JSON.parse(localStorage.getItem("tbPaymentRecords"));

    if (tbPurchaseRecords == null && tbPaymentRecords == null) {
      alert("No records exist yet");

      $(location).attr("href", "#pageMenu");
    } else {
      setupCanvas();

      var amtArr = new Array();
      var dateArr = new Array();
      getAmtHistory(amtArr, dateArr);

      var amtLower = new Array(2);
      var amtUpper = new Array(2);
      getAmtBounds(amtLower, amtUpper);

      drawLines(amtArr, dateArr, amtLower, amtUpper);
      labelAxes();
	    
	    
   } 
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}
    
/*
  setupCanvas will get the GraphCanvas element and will add a rectangle for
  the background to the context of the canvas
*/
function setupCanvas() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");

  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, 500, 500);
}

/*
  getAmtHistory will take in an empty array for TSH values and an empty array 
  for date values and try to fill it with the values from tbRecords in local
  storage.
*/
function getAmtHistory(amtArr, dateArr) {
  try {
    var tbPurchaseRecords = JSON.parse(localStorage.getItem("tbPurchaseRecords"));
    var tbPaymentRecords = JSON.parse(localStorage.getItem("tbPaymentRecords"));

    var user = JSON.parse(localStorage.getItem("user"));    
    var totalOwed = parseFloat(user.TotalBalance);
    var setItems = {};
    var total = 0;	  
      
    for (var i = 0; i < tbPurchaseRecords.length; i++) {
      var currRecord = tbPurchaseRecords[i];
            	    
      if(i == 0) {
        setItems[currRecord.SpendingDate] = totalOwed + parseFloat(currRecord.SpendingAmount);
	total = totalOwed + parseFloat(currRecord.SpendingAmount);     
      }	else {
          
	  setItems[currRecord.SpendingDate]= total + parseFloat(currRecord.SpendingAmount);
          total = setItems[currRecord.SpendingDate];		  
      }
        
    }
  
    for (var i = 0; i < tbPaymentRecords.length; i++) {
      var currRecord = tbPaymentRecords[i];
      if (setItems[currRecord.PaymentDate] == null) {
        setItems[currRecord.PaymentDate] = parseFloat(currRecord.PaymentAmount);     
      } else {
        setItems[currRecord.PaymentDate] = setItems[currRecord.PaymentDate] -parseFloat(currRecord.PaymentAmount); 
      }

    }
    //referencing https://stackoverflow.com/questions/10946880/sort-a-dictionary-or-whatever-key-value-data-structure-in-js-on-word-number-ke/10946984
    var keys = Object.keys(setItems);	  
    keys.sort();
    for (var i=0; i<keys.length; i++) { 
	
	var date = new Date(keys[i]);
        var month = date.getMonth() + 1;
        var day = date.getDate() + 1;
        dateArr.push(month + "/" + day);
  	amtArr.push(parseFloat(setItems[keys[i]]));
    }
		  
       	  
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*
  getAmtBounds takes in an empty array for the lower Amt bound values and an
  empty array for the upper Amt bound values.  It will try to get the user
  from local storage to determine and fill in these bound arrays.
*/
function getAmtBounds(amtLower, amtUpper) {
  try {
    
    var user = JSON.parse(localStorage.getItem("user"));
     	  
    amtUpper[0] = user.CreditLimit;
    amtUpper[1] = user.CreditLimit;
    amtLower[0] = 0;
    amtLower[1] = 0;
    
  } catch(e) {
    if (window.navigator.vendor === "Google Inc.") {
      if(e === DOMException.QUOTA_EXCEEDED_ERR) {
        alert("Error: Saving to local storage.");
      }
    } else if (e === QUOTA_EXCEEDED_ERR) {
      alert("Error: Saving to local storage.");
    }

    console.log(e);
  }
}

/*
  drawLines will take in an array representing the Amount owed, an array
  representing the date values, an array representing the upper bound, and
  an array representing the lower bound.  It will use these values to draw
  a line graph and add it to the GraphCanvas element.
*/
function drawLines(amtArr, dateArr, amtUpper, amtLower) {
  var amtLine = new RGraph.Line("GraphCanvas", amtArr, amtUpper, amtLower)
    .Set("labels", dateArr)
    .Set("colors", ["blue", "green", "green"])
    .Set("shadow", true)
    .Set("shadow.offsetx", 1)
    .Set("shadow.offsety", 1)
    .Set("linewidth", 1)
    .Set("numxticks", 6)
    .Set("scale.decimals", 2)
    .Set("xaxispos", "bottom")
    .Set("gutter.left", 40)
    .Set("tickmarks", "filledcircle")
    .Set("ticksize", 5)
    .Set("chart.labels.ingraph", [,["Amount Owed", "blue", "yellow", 1, 50]])
    .Set("chart.title", "Amount Owed")
    .Draw();
}

/*
  labelAxes will get the context of the GraphCanvas element and add text
  for the x and y axis labels
*/
function labelAxes() {
  var canvas = document.getElementById("GraphCanvas");
  var context = canvas.getContext("2d");

  context.font = "11px Georgia";
  context.fillStyle = "green";
  context.fillText("Date (MM/DD", 400, 470);
  context.rotate(-Math.PI / 2);
  context.textAlign = "center";
  context.fillText("Amount Owed", -250, 10);
}


/*
 * This function will help with sorting
 */
function compareDates(a, b)
{
  var x=new Date(a.Date);
  var y=new Date(b.Date);
 
  console.log("hello we are hee");	

  console.log(x);
  console.log(y);	

  if(x>y)
  {
    console.log(1);
     return 1;

  }
  else
  {
    console.log(-1);	  
    return -1;
  }
}

