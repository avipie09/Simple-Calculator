let input = document.getElementById("inp");
let buttons = document.querySelectorAll("button");

let string = "";
let arr = Array.from(buttons);

let isprint = false;

arr.forEach(button => {
    button.addEventListener("click", (e) => {

        let val = e.target.innerHTML;

        if (val == "=") {
            if (string == "") {
                input.value = "what???";
                string = "";
            } else {

                string = eval(string).toString();
                if (string.length > 8) {
                    string = string.slice(0, 8);
                }

                input.value = string;
                isprint = true;
            }

        } 
        else if (val === "AC") {
            string = "";
            input.value = "";
            isprint = false;

        } 
        else if (val === "DEL") {
            string = string.slice(0, -1);
            input.value = string;

        } else {

            if (isprint) {
                
                if (!isNaN(val)) {
                    string = val;
                }
                
                else {
                    string += val;
                }
                
                isprint = false;

            } else {
                string += val;
            }

            input.value = string;
        }
    });
});