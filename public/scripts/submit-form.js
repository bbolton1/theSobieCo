import {formData} from "./registration-form.js";
jQuery(() => {
    async function passForm() {
        const url = 'https://dev-sobieconference.onrender.com/register'; // Test URL

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(formData),
            mode: "cors",

        }
        const response = await fetch(url, fetchOptions);
        return await response.json();
    }
    // $("#submitForm").on("click", function() {
    //     $(this).prop("disabled", true);
    //     $(this).html("<dotlottie-player\n" +
    //         "  src=\"/images/loading-bar.lottie\"\n" +
    //         "  background=\"transparent\"\n" +
    //         "  speed=\"1\"\n" +
    //         "  style=\"width: 50px; height: 20px\"\n" +
    //         "  loop\n" +
    //         "  autoplay\n" +
    //         "></dotlottie-player>")
    //     passForm()
    //     .then(data => {
    //         let backendAnswer = data["result"] // Answer could be either true or false; determines if backend accepted our request.
    //         if (backendAnswer) {
    //             $("#showResult").modal("show");
    //             $('#submitFormConfirm').modal('hide');
    //         } else {
    //             $("#submitForm").html("Submit")
    //             $("#confirmationMessage").html("Error! Please try again.")
    //             $("#submitForm").prop("disabled", false);
    //             console.log("Error occurred")
    //         }
    //     });
    //     $("submitForm")
    // })
        
})