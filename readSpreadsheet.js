function readSpreadsheet() {
    //Open the spreadsheet
    var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/[GET THE URL OF YOUR SPREADSHEET]/edit#gid=0");
    //Get a range of rows from the spreadsheet
    var range = sheet.getDataRange();
    //Get the number of rows in the spreadsheet range
    var numRows = range.getNumRows();
    //Get the values of the range of rows in the spreadsheet
    var values = range.getValues();
    //Open the form by URL and assign it to a local object
    var form = FormApp.openByUrl('https://docs.google.com/forms/d/[GET THE URL OF YOUR FORM]/viewform?usp=send_form');
    //Make an object of the questions in the Form. These are the questions defined when the form was designed, not the responses to the questions already submitted. 
    var items = form.getItems();
    //Loop through every row in the spreadsheet
    for (var i = 1; i < numRows; i++) {
        //This incremental element in the values array is a row
        var value = values[i];
        //Log the loop number, just for sanity checking
        Logger.log("This is loop number " + i + " through the spreadsheet.");
        //Create a form response object for this row of the spreadsheet
        //This is a new object which will be saved as a new response to the form
        var formResponse = form.createResponse();
        //Make a counter for the cells in the spreadsheet row
        //Starting a the number one because column B has the survey number values
        var k = 1;
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
                    //case FormApp.ItemType.MULTIPLE_CHOICE: item=items[j].asMultipleChoiceItem(); break;
                    //case FormApp.ItemType.SCALE: item=items[j].asScaleItem(); break;
                case FormApp.ItemType.PARAGRAPH_TEXT:
                    item = items[j].asParagraphTextItem();
                    break;
                    //case FormApp.ItemType.<OTHER_TYPE>: item=items[j].as<OtherType>Item(); break;
                default:
                    Logger.log("#" + (i + 1) + ":Do nothing for item " + j + " of type " + items[j].getType());
                    //The continue statement "jumps over" one iteration in the loop.
                    //The loop in this case is the j-counter loop of every element in the new form response items array
                    continue;
                    //The break statement "jumps out" of a loop.
                    break;
                    //Close the loop
            }
            //At this point, because of a break statement in the j-counter loop a TEXT or PARAGRAPH_TEXT element in the formResponse collection has been chosen and assigned to the item object. 
            //Now put the String value from the cell in the spreadsheet at k-position into this element and increment the k-counter to point to the next cell in the spreadsheet row
            formResponse.withItemResponse(item.createResponse(value[k++]));
            //Close the loop
        }
        //Submit the form response
        formResponse.submit();
        //Sleep for a second to make sure every form response gets a unique timestamp
        Utilities.sleep(1000);
        //Close the loop
    }
    //Close the function
}
