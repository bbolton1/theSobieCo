//🪣@garrettbouldin 4.25.2025 iss #4

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
  
  //more code here...
});

console.log("This is the official SOBIE website!");

const updateData = () => {
  return {
    question: {
      email: document.getElementById("inputEmail").value || "N/A",
      questionAsked: document.getElementById("question").value || "N/A", 
    },    
  };
};

const submitQuestionBtn = document.getElementById("submitQuestionBtn");

submitQuestionBtn.addEventListener("click", () => {
  const updatedData = updateData();
  console.log(JSON.stringify(updatedData, null, 2));
});