# Copy values from a spreadsheet to a form

## References
* http://bachmeb.weebly.com/copy-values-from-a-google-spreadsheet-to-a-google-form-with-google-apps-script.html
* https://developers.google.com/apps-script/reference/forms/
* https://developers.google.com/apps-script/reference/spreadsheet/

##### Create the Google Form. Note the URL.
* https://docs.google.com/forms/
 
##### Create the Google Spreadsheet. Note the URL.
* https://docs.google.com/spreadsheets/u/0/

##### Populate the spreadsheet with the values which will be added to the form. Rows are individual form entries. Columns are questions on the form.
```
```

##### Open the Google Form Script Editor
    Tools > Script Editor

##### Create a new blank script
    File > New > Script File: "Hello"

##### Create a new function in the script
```
function hello() {

  Logger.log("Hello")
  
}
```

##### Run the function and check the log
    Run > hello
    View > Logs

##### Create a new script file in the project and name it Read Spreadsheet
    File > New > Script file: "Read Spreadsheet"
    
##### Create a new function and add the following statements to the function.
```javascript
var formURL = "https://docs.google.com/forms/[THE URL OF YOUR FORM]";
var sheetURL = "https://docs.google.com/spreadsheets/[THE URL OF YOUR SPREADSHEET]";

function main() {
  readSpreadsheet();
}

function readSpreadsheet() {
  //Open the spreadsheet
  var sheet = SpreadsheetApp.openByUrl(sheetURL);
  Logger.log("The name of the sheet is " + sheet.getSheetName());
  //Get a range of rows from the spreadsheet
  var range = sheet.getDataRange();
  //Get the number of rows in the spreadsheet range
  var numRows = range.getNumRows();
  //Get the values of the range of rows in the spreadsheet
  var values = range.getValues();
  Logger.log("There are this many values in the values array: " + values.length);
  //Open the form by URL and assign it to a local object
  var form = FormApp.openByUrl(formURL);
  Logger.log("The name of the form is " + form.getTitle());
  /*Make an object of the questions in the Form. 
  These are the questions defined when the form was designed, 
  not the responses to the questions already submitted.*/
  var items = form.getItems();
  //Loop through every row in the spreadsheet
  //Start at 1 if the spreadsheet has a header row
  for (var i = 0; i < numRows; i++) {
    //This incremental element in the values array is a row
    var value = values[i];
    //Log the loop number, just for sanity checking
    Logger.log("This is loop number " + i + " through the spreadsheet.");
    //Create a form response object for this row of the spreadsheet
    //This is a new object which will be saved as a new response to the form
    var formResponse = form.createResponse();
    //Make a counter for the cells in the spreadsheet row
    //Start at a number greater than 0 to skip columns
    var k = 0;
    //now loop through the items in the new form response object and test the type of each
    for (var j = 0; j < items.length; j++) {
      //declare a new item (an answer to a question)
      var item;
      //test the type of the item at j point in the new form response items array
      switch (items[j].getType()) {
        //if the item is a text value, assign this item to the var item and break the switch statement
        case FormApp.ItemType.TEXT:
          item = items[j].asTextItem();
          break;
        case FormApp.ItemType.PARAGRAPH_TEXT:
          item = items[j].asParagraphTextItem();
          break;
        default:
          Logger.log("#" + (i + 1) + ":Do nothing for item " + j + " of type " + items[j].getType());
          //Skip the rest of the code in this for loop and begin the next loop
          continue;
          //Close the switch statement
      }
      /* At this point, because of a break in the previous switch statement, 
      a TEXT or PARAGRAPH_TEXT element was found in the formResponse collection 
      and has been assigned to the item object. 
      Now put the String value from the cell in the spreadsheet at k-position into this element 
      and increment the k-counter to point to the next column in the spreadsheet row */
      formResponse.withItemResponse(item.createResponse(value[k++]));
    }
    //Submit the form response
    formResponse.submit();
    //Sleep for a second to make sure every form response gets a unique timestamp
    Utilities.sleep(1000);
  }
}
```
##### Run the main function
    Run > main
