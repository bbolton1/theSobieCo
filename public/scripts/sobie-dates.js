$(function() {
   

const sobieDates = {
  sobieYear: "2025",
  sobieStartDate: new Date("Apr 9 2025 00:00:00 CST"), 
  sobieEndDate: new Date("Apr 11 2025 00:00:00 CST"),
  sobieCallForPapersDate: {
    ready: false,
    estimate: "TBA mid December",
    actual: ""},
  sobieRegistrationDate: {
    ready: false, 
    estimate: "TBA mid March"}
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const start = sobieDates.sobieStartDate; 
const end = sobieDates.sobieEndDate; 

const sobieDate = `${weekday[start.getDay()]},  ${month[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} to ${weekday[end.getDay()]},  ${month[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;

$('#sobieDates').text(sobieDate); 

const thisSobieYear = sobieDates.sobieYear; 
for (j=0; j<thisSobieYear.length; j++){
  
  // condition ? exprIfTrue : exprIfFalse
    
  j == thisSobieYear.length-1 ?   $('#sobieYear').append(`${thisSobieYear[j]}`) : $('#sobieYear').append(`${thisSobieYear[j]}·`)

}


  
});

