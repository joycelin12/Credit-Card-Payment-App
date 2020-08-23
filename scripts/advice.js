/*
  Assignment: Credit Card Payment App
  Author: Peiyu Williamson
  Date: 8/20/2020
  Purpose: To provide the functionality for displaying advice based
    on the records in local storage
*/

/*
  showAdvice will try to get the tbPurchaseRecords and tbPaymentRecords from
  localStorage.  If there are no records, then it will alert the user 
  and return to the menu page. Otherwise, it will get the user and all records 
  from tbPurchaseRecords and tbPaymentRecords. It will get the total credit limit
  from the user and all the record and use those to draw the advice gauge and display
  the suggested actions.
*/
function showAdvice() {
  try {
    var tbPurchaseRecords = JSON.parse(localStorage.getItem("tbPurchaseRecords"));
    var tbPaymentRecords = JSON.parse(localStorage.getItem("tbPaymentRecords"));

    if (tbPurchaseRecords == null && tbPaymentRecords == null) {
      alert("No records exist yet");

      $(location).attr("href", "#pageMenu");
    } else {
      var user = JSON.parse(localStorage.getItem("user"));
      var creditLimit = parseFloat(user.CreditLimit);	    
      var totalOwed = parseFloat(user.TotalBalance);	    
      
      if (tbPurchaseRecords != null) {
        for(i =0; i <= tbPurchaseRecords.length - 1; i++) 
	{
          
	  totalOwed += parseFloat(tbPurchaseRecords[i].SpendingAmount);
	}
      }
      
      if (tbPaymentRecords != null) {
        for(i =0; i <= tbPaymentRecords.length - 1; i++) 
	{
          totalOwed -= parseFloat(tbPaymentRecords[i].PaymentAmount);
	}
      }
	    
      
      var canvas = document.getElementById("AdviceCanvas");
      var context = canvas.getContext("2d");
      context.fillStyle = "#C0C0C0";
      context.fillRect(0, 0, 550, 550);
      context.font ="22px Arial";
      drawAdviceCanvas(context, creditLimit, totalOwed);
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
  drawAdviceCanvas takes in a 2d context of a canvas, a target credit limit, and 
  total owed.  It will add text to the context stating the total owed, the 
  target credit limit, the advice based on the total owed with respect to the 
  target credit limit, and draw the gauge based on the given values.
*/
function drawAdviceCanvas(context, creditLimit, totalOwed) {
  context.font = "22px Arial";
  context.fillStyle = "black";
  context.fillText("Your total owed is " + totalOwed + ".", 25, 320);
  
  var percent = totalOwed/creditLimit;	

  if (percent <= 0.1) {
    context.fillText("Your credit limit is less than 10%.", 25, 350);
    levelAWrite(context, percent);
    levelAMeter(context, percent);
  } else if (percent >0.1 && percent <=0.3 ) {
    context.fillText("Your credit limit is between 10% to 30%.", 25, 350);
    levelAWrite(context, percent);
    levelAMeter(context, percent);
  } else if (percent >0.3 ) {
    context.fillText("Your credit limit is greater than 30%.", 25, 350);
    levelAWrite(context, percent);
    levelAMeter(context, percent);
  }
}

/*
  levelAWrite will take in a 2d context of a canvas and percentage of credit limit.  It will
  write the advice to the context based on the percentage of credit limit  using ranges for level
  A.
*/
function levelAWrite(context, percent) {
  if (percent <= 0.1) {
    writeAdvice(context, "green");
  } else if ((percent > 0.1) && (percent <= 0.3)) {
    writeAdvice(context, "yellow");
  } else {
    writeAdvice(context, "red");
  }
}


/*
  writeAdvice will take in a 2d context of a canvas and a level color as a
  string that represents the advice rating that is needed.  It will write the
  corresponding advice message to the context.
*/
function writeAdvice(context, level) {
  var adviceLine1 = "";
  var adviceLine2 = "";

  if (level == "red") {
    adviceLine1 = "Please consult with your financial";
    adviceLine2 = "planner urgently.";
  } else if (level == "yellow") {
    adviceLine1 = "Please consult your financial planner";
    adviceLine2 = "in 6-8 weeks.";
  } else if (level == "green") {
    adviceLine1 = "You are doing a good job keeping your credit limit.";
  }

  context.fillText("Your credit level is " + level + ".", 25, 380);
  context.fillText(adviceLine1, 25, 410);
  context.fillText(adviceLine2, 25, 440);
}

/*
  levelAMeter will take in a 2d context of a canvas and a percentage of 
  credit limit.  It will check if the percentage value is less than or equal to 10%.
  If it is, it will create a corner gauge based with an upper bound of 100.  
  Otherwise, it will create a corner gauge with an upper bound of the TSH value.  
  Finally, it will draw the gauge on the context. Assumes a level A credit limit value.
*/
function levelAMeter(context, percent) {
  var gauge = new RGraph.CornerGauge("AdviceCanvas", 0, 1, percent)
      .Set("chart.colors.ranges", [[0.3, 1, "red"], [0.1, 0.3, "yellow"],
      [0, 0.1, "green"]]);
  drawMeter(gauge);
}

/*
  drawMeter will take in a corner gauge object and apply final settings for
  this gauge representing the TSH Level and draw it
*/
function drawMeter(gauge) {
  gauge.Set("chart.value.text.units.post", " %")
    .Set("chart.value.text.boxed", false)
    .Set("chart.value.text.size", 14)
    .Set("chart.value.text.font", "Verdana")
    .Set("chart.value.text.bold", true)
    .Set("chart.value.text.decimals", 2)
    .Set("chart.shadow.offsetx", 5)
    .Set("chart.shadow.offsety", 5)
    .Set("chart.scale.decimals", 2)
    .Set("chart.title", "Credit Limit")
    .Set("chart.radius", 250)
    .Set("chart.centerx", 50)
    .Set("chart.centery", 250)
    .Draw();
}
