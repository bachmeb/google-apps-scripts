function readSpreadsheet() {
  
  Logger.log("Hello. The time is " + Date.now() );
  
  //Open the spreadsheet
  var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/18HI_TxK4nttGt5-WqHjOTbtJ_QAESyNyQsmc3Y4d9Zo/edit#gid=0");
  Logger.log("The name of the sheet is " + sheet.getSheetName());
  
  //Get a range of rows from the spreadsheet
  var range = sheet.getDataRange();
  //Get the number of rows in the spreadsheet range
  var numRows = range.getNumRows();
  //Get the values of the range of rows in the spreadsheet
  var values = range.getValues();
  Logger.log("There are this many values in the values array: " + values.length);
  //Open the form by URL and assign it to a local object
  var form = FormApp.openByUrl('https://docs.google.com/forms/d/1ntHqAZS0u-pAQHvI2k73_dCQsYQQ4U8eNPhlYewUV4o/edit');
  Logger.log("The name of the form is " + form.getTitle() );
  //Make an object of the questions in the Form. These are the questions defined when the form was designed, not the responses to the questions already submitted. 
  var items = form.getItems();
  //Loop through every row in the spreadsheet
  for (var i = 0; i < numRows; i++) {
    //This incremental element in the values array is a row
    var value = values[i];
    //Log the loop number, just for sanity checking
    Logger.log("This is loop number " + i + " through the spreadsheet.");
    //Create a form response object for this row of the spreadsheet
    //This is a new object which will be saved as a new response to the form
    var formResponse = form.createResponse();
    //Make a counter for the cells in the spreadsheet row
    //Starting at the number 0 because column A has the FORM NUMBER
    var k = 0;
    //Now loop through the items in the new form response object and test the type of each
    //The order of the items in the form response object will match the order that the items are arranged on the form
    //It is critical here that the order of the columns in the spreadsheet matches the order of the items in the form response object 
    for (var j = 0; j < items.length; j++) {
      //declare a new item (an answer to a question)
      var item;
      //test the type of the item at j point in the new form response items array
      switch (items[j].getType()) {
          //if the item is a text value, assign this item to the var item and break the switch statement
        case FormApp.ItemType.TEXT:
          item = items[j].asTextItem();
          Logger.log("Item number " + j + " is titled: " + item.getTitle() );
          break;
        case FormApp.ItemType.PARAGRAPH_TEXT:
          item = items[j].asParagraphTextItem();
          Logger.log("Item number " + j + " is titled: " + item.getTitle() );
          break;    
        default:
          Logger.log("#" + (i + 1) + ":Do nothing for item " + j + " of type " + items[j].getType());
          //Skip the rest of the code in this for loop and begin the next loop
          continue;
          //Close the switch statement
      } 
      //At this point, because of a break in the previous switch statement, a TEXT or PARAGRAPH_TEXT element was found in the formResponse collection and has been assigned to the item object. 
      //Now put the String value from the cell in the spreadsheet at k-position into this element and increment the k-counter to point to the next cell in the spreadsheet row
      if(j==0){
        Logger.log("This item is the FORM NUMBER");
        formResponse.withItemResponse(item.createResponse(value[k++]));
      };
      
      //Close the loop through the items in the form response object
    }
    //Submit the form response
    formResponse.submit();
    //Sleep for a second to make sure every form response gets a unique timestamp
    Utilities.sleep(1000);
    //Close the loop through every row in the spreadsheet
  }
  //Close the function
}
