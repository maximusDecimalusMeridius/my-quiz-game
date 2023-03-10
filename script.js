// Latching onto our HTML friends
// ID elements
let questionSelectNode = document.getElementById("question-select");          //Welcome message window
let quizContainerNode = document.getElementById("quiz-container");         //Main quiz container and window
let quizQuestionNode = document.getElementById("quiz-question-text");       //Quiz Question where most of the content populates
let quizQuestionTitleNode = document.getElementById("quiz-header-title");   //Welcome title and "Question" title
let prevButton = document.getElementById("prev-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let submitButton = document.getElementById("submit-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let quizBannerNode = document.getElementById("quiz-header-status");   //Pop up in the quiz window that will display various status messages
let quizBannerLanguageNode = document.getElementById("quiz-header-message");    //The message inside th pop up slider

// Class elements
let colorMenuItemNodes = document.getElementsByClassName("color-menu-items");       //Divs that hold the check boxes and bubbles for color switching
let colorCheckboxNodes = document.getElementsByClassName("colorCheckbox");               //Color checkboxes for users to choose the text color;
let rangeNodes = document.getElementsByClassName("ranges");                   //Range sliders in quiz intro for selecting number of questions
let answerNodes = document.getElementsByClassName("answer-options");
let sumNode = document.getElementById("sumNode");                                   //Sum of questions user will receive

// Initialize global vars
let quizDeck = [];
let playerDeck = [];
let deckCounter = 0;
let answerArray = [];

// js to reset slider value to the default value of input
for(let i = 0; i < rangeNodes.length; i++){
    rangeNodes[i].value = rangeNodes[i].getAttribute("value");
}

// Event listeners to make answer options glow on mouseover with delegation
quizContainerNode.addEventListener("mouseover", (event) => {
    if(event.target.className === "answer-options" && submitButton.dataset.gameMode === "game" && event.target.dataset.selected != "true"){
        event.target.setAttribute("style", "background-color: var(--light-blue)");
    }
});

// Event listener to clear box-shadow.  When font-style is set to none, it still seems to clear out my event listener without
// explicitly changing the box-shadow.  Oddly if I remove this mouseout event, formatting stays when I mouse out.
quizContainerNode.addEventListener("mouseout", (event) => {
    if(event.target.className === "answer-options" && event.target.dataset.selected != "true"){
        event.target.setAttribute("style", "font-style: none;");
    }
});

// Event listener that looks for clicks on answer nodes.  If an answer is already selected and clicked again, it will be deselect.
// If another box is selected, the listener loops over the array of answers and reset their formatting and selected data-attr before 
// assigning the new value and formatting.
quizContainerNode.addEventListener("click", (event) => {
    if(event.target.className === "answer-options" && submitButton.dataset.gameMode === "game"){
        if(event.target.style.fontWeight != "bold"){
            
            for(let i = 0; i < answerNodes.length; i++){
                answerNodes[i].setAttribute("style", "font-weight: none; background-color: white; color: black;");
                answerNodes[i].dataset.selected = "false";
            }
            
            event.target.setAttribute("style", "font-weight: bold; background-color: var(--navy-blue); color: white;");
            event.target.dataset.selected = "true";
        } 
        
        else {
            event.target.setAttribute("style", "font-weight: none; background-color: white; color: black;");
            event.target.dataset.selected = "false";
        }
    }
    
});

// Event listener to update the text field beneath the slider, the sum div, and call the addMeUp() function to
// update the value attr of <input> in real-time
questionSelectNode.addEventListener("input", (event) => {
    
    if(event.target.className == "ranges"){
        event.target.nextSibling.innerText = event.target.value;
        event.target.setAttribute("value", event.target.value);
        sumNode.innerText = addEmUp();
    }
})

// Add event listeners to all the color menu checkboxes, details inside
for(let i = 0; i < colorMenuItemNodes.length; i++){
    
    // Each styled oval, color checkbox
    colorMenuItemNodes[i].addEventListener("click", (event) => {
        let checkboxChild;
        let bubbleChild;
        
        // Setting checkbox and bubble values based on where user clicks
        // **Initial bug found clicking on edge of box did not activate scritps because node assignments
        // were misaligned**
        if(event.target.nodeName === "LI"){
            checkboxChild = event.target.firstChild;
            bubbleChild = event.target.lastChild;
        } else {
            checkboxChild = event.target.parentNode.firstChild;
            bubbleChild = event.target.parentNode.lastChild;
        }

        // Reset the position of all checkbox bubbles
        for(let j = 0; j < colorCheckboxNodes.length; j++){
            colorCheckboxNodes[j].checked = false;
            colorCheckboxNodes[j].parentNode.lastChild.setAttribute("style","left: 2px;");
            colorCheckboxNodes[j].parentNode.firstChild.setAttribute("style","box-shadow: ''");
        }

        // Check the appropriate box, style the color of the question window's text, reposition the bubble
        // to the right (left: 18px), and set a same colored box shadow.
        checkboxChild.checked = true;
        quizQuestionNode.setAttribute("style",`color: ${checkboxChild.value}`)
        bubbleChild.setAttribute("style","left: 18px;")
        checkboxChild.setAttribute("style", `box-shadow: 2px 4px 4px ${checkboxChild.value}`);
    })

}

// Function to get all values from the ranges on HTML, add them up,
// and output them to the screen in real-time
function addEmUp() {
    let sum = 0;
    for(let i = 0; i < 4; i++){
        sum = sum + parseInt(rangeNodes[i].value);
    }
    return sum;
}

// Passed arguments for how many cards of each deck the user selected
// Randomly chooses that many of cards from the deck and stages them
// Randomizes the final array into playerDeck by shift(), pop(), or splice()
function randomizeDecks(htmlCards, cssCards, jsCards, genCards) {
    let quizDeckIndex = 0;
    let stageDeck = [];

    for(let i = 0; i < htmlCards; i++){
        stageDeck[quizDeckIndex] = htmlQuestions.splice(Math.floor(Math.random() * htmlQuestions.length), 1)[0];
        quizDeckIndex++;
    }
    for(let i = 0; i < cssCards; i++){ 
        stageDeck[quizDeckIndex] = cssQuestions.splice(Math.floor(Math.random() * cssQuestions.length), 1)[0];
        quizDeckIndex++;
    }
    for(let i = 0; i < jsCards; i++){
        stageDeck[quizDeckIndex] = jsQuestions.splice(Math.floor(Math.random() * jsQuestions.length), 1)[0];
        quizDeckIndex++;
    }
    for(let i = 0; i < genCards; i++){
        stageDeck[quizDeckIndex] = genQuestions.splice(Math.floor(Math.random() * genQuestions.length), 1)[0];
        quizDeckIndex++;
    } 

   let initialStringLength = stageDeck.length;

        for(let i = 0; i < initialStringLength; i++){
            switch (Math.floor(Math.random() * 3)){
            
                case (0):
                    playerDeck[i] = stageDeck.shift();
                    break;
                case (1):
                    playerDeck[i] = stageDeck.pop();
                    break;
                case (2):
                    playerDeck[i] = stageDeck.splice(Math.floor(Math.random() * stageDeck.length) , 1)[0];
                    break;
                default:
                    alert('error');
                }
        }
}

function pickCard(deck, direction){

    let currentQuestion;

    function updateQuestion(){
        quizQuestionTitleNode.innerText = `Question ${deckCounter + 1} / ${playerDeck.length}`;
        typeWriter(currentQuestion.content);
        answerNodes[0].innerText = currentQuestion.answers[0];
        answerNodes[1].innerText = currentQuestion.answers[1];
        answerNodes[2].innerText = currentQuestion.answers[2];
        answerNodes[3].innerText = currentQuestion.answers[3];
        popUpStatus(currentQuestion.language);
        // if(answerArray[deckCounter])
    
        clearAnswers();
        if(answerArray[deckCounter] != undefined  && answerNodes[answerArray[deckCounter][1]] != undefined) {
            answerNodes[answerArray[deckCounter][1]].setAttribute("style", "font-weight: bold; background-color: var(--navy-blue); color: white;");
            answerNodes[answerArray[deckCounter][1]].dataset.selected = "true";
        }
    }

    if(direction === "next"){
        if(deckCounter < deck.length){
            currentQuestion = deck[deckCounter];
            updateQuestion();
            deckCounter++;
        }
    }

    if(direction === "prev"){
        deckCounter -= 2;
        currentQuestion = deck[deckCounter];
        updateQuestion();
        deckCounter++;
    }

}

function grader(indexOfGradedQuestion) {
    let compareArray = [];
    let somethingSelected = false;
    
    compareArray.push(`Question-${indexOfGradedQuestion + 1}`);           //Set compareArray[0] to Question title
    for(let i = 0; i < 4; i++){
        if(answerNodes[i].dataset.selected === "true"){
            compareArray.push(i);                                         //Set compareArray[1] to the selected value
            somethingSelected = true;                                     //update somethingSelected to true
        }
    }
    if(somethingSelected === false){
        compareArray.push("");                                            //If nothing is selected, push a blank space
    }
    
    compareArray.push(playerDeck[indexOfGradedQuestion].answerIndex);     //Set compareArray[2] to the answer index in playerDeck[deckCounter - 1]
    answerArray[indexOfGradedQuestion] = compareArray;
    clearAnswers();
}

// Pop up manager displays the question.language for the question displayed
function popUpStatus(message) {

    // Assigning color to template literal ${color} for borders and text coloring
    let color;
    if (message === "HTML"){
        color = "var(--html-yellow)";
    } else if (message === "CSS"){
        color = "var(--css-blue)";
    } else if (message === "JavaScript"){
        color = "var(--js-pink)";
    } else {
        color = "var(--gen-green)";
    }

    // Set banner message, show pop up, disable submit and previous buttons until animation finishes
    quizBannerLanguageNode.innerText = message;
    quizBannerNode.setAttribute("style", `bottom: 50px; border: 3px solid ${color}`);
    submitButton.disabled = true;
    prevButton.disabled = true;

    // After half a second, pop out message
    let slideRight = setTimeout( () => {
        quizBannerLanguageNode.setAttribute("style", `right: 10px; color: ${color};`);
    }, 500)

    // Hide the pop up message, retaining border color and enabling buttons
    let timeOut = setTimeout( () => {
        quizBannerNode.setAttribute("style", `bottom: -40px; border: 3px solid ${color}`);
        submitButton.disabled = "";
        prevButton.disabled = "";
    }, 3000);

    // Asynchronous function to set the message text back to the left .5s after the pop-up hides
    let slideLeft = setTimeout( () => {
        quizBannerLanguageNode.setAttribute("style", `right: 105%;  color: ${color})`);
    }, 3500)

}

// Utility typewriter function to display text like a typewriter
function typeWriter(textToDisplay){
 
    // Set typing speed and initialize the content and counter
    let typeSpeed = 25;
    let typedContent = "";
    let loopCounter = 0;
    
    // Using set interval to run as long as the loop counter is less than the length of our string
    // based on the setting of variable typeSpeed
    let typeLetters = setInterval(() => {
        if(loopCounter < textToDisplay.length){
            typedContent += textToDisplay.charAt(loopCounter);
            quizQuestionNode.innerText = typedContent;
            loopCounter++;
        } else {
            clearInterval(typeLetters);
        }
        }, typeSpeed)
}

// Utility function to calculate a random number
function randomNumber(num){
    return (Math.floor(Math.random() * num));
}

// Utility function to clear all answer
function clearAnswers() {
    for(let i = 0; i < 4; i++){
        answerNodes[i].dataset.selected = "false";
        answerNodes[i].setAttribute("style", "font-weight: none; background-color: white; color: black;");
    }
}

// Hides question Selection, shows previous button and updates status of submit button
function startQuiz(){
    questionSelectNode.setAttribute("style", "display: none");
    sumNode.setAttribute("style", "display: none");
    prevButton.setAttribute("style", "display: block;");
    submitButton.dataset.gameMode = "game";
    submitButton.innerText = "Next";
}

function finishGame(){
    let unanswered = 0, incorrect = 0, correct = 0;
    
    //Calculate and display stats  **Need to run edge cases on this**
    for(let i = 0; i < answerArray.length; i++){
        if(answerArray[i][1] === ""){
            unanswered++;
        } else if (answerArray[i][1] != answerArray[i][2]){
            incorrect+=1;
        } else if (answerArray[i][1] == answerArray[i][2]) {
            correct+=1;
        }
    }

    console.log("Correct: " + correct + "\nIncorrect: " + incorrect + "\nUnanswered: " + unanswered);

    //Reinitialize all values
    quizDeck = [];
    playerDeck = [];
    deckCounter = 0;
    answerArray = [];
}

// Event listener for the submit button to update the start button for the quiz
// and display prevButton
submitButton.addEventListener("click", (event) => {
    event.preventDefault;
    if(sumNode.innerText !== "0"){
        if(submitButton.innerText === "Start!"){
            randomizeDecks(rangeNodes[0].value, rangeNodes[1].value, rangeNodes[2].value, rangeNodes[3].value);
            startQuiz();
            pickCard(playerDeck, "next");
        } else if (deckCounter < playerDeck.length){
            grader(deckCounter - 1);                        //check grades and increment deck counter;
            pickCard(playerDeck, "next");
        } else {
            grader(deckCounter - 1);
            finishGame();
            alert("thanks for playing!");
        }
    }
});

prevButton.addEventListener("click", (event) => {
    event.preventDefault;
    if(deckCounter >= 2){
        grader(deckCounter - 1);
        pickCard(playerDeck, "prev");
    }
})



























// Quiz question class
class quizQuestion {
    constructor(title, content, answers, answerIndex, hint, w3link, language){
        this.title = title;
        this.content = content;
        this.answers = answers;
        this.answerIndex = answerIndex;
        this.hint = hint;
        this.w3link = w3link;
        this.language = language;
    }
}

let htmlQuestion1 = new quizQuestion(
    "Question 1",
    "HTML stands for:",
    [
        "Hyper Text Made-up Language",
        "Hyper Text Markup Language",
        "Hello There, M'Lady!",
        "Hyped up Marker Language"
    ],
    1,
    "Browsers can interpret marked up language",
    "https://www.w3schools.com/html/html_intro.asp",
    "HTML"
)

let htmlQuestion2 = new quizQuestion(
    "Question 2",
    "Which of the following are semantic tags:",
    [
        "divider, paragraph, span",
        "header, section, aside",
        "html, css, javascript",
        "src, alt, value"
    ],
    1,
    "These tags help screen readers understand the flow of your document",
    "https://www.w3schools.com/html/html5_semantic_elements.asp",
    "HTML"
)

let htmlQuestion3 = new quizQuestion(
    "Question 3",
    "This is the proper syntax for linking a script.js file",
    [
        "!link script.js",
        "<link type='script.js' src='./script.js'>",
        "find 'script.js'",
        "<script src='./script.js'></script>"
    ],
    3,
    "We link our js script in a separate section of the HTML",
    "https://www.w3schools.com/tags/att_script_src.asp",
    "HTML"
)

let htmlQuestion4 = new quizQuestion(
    "Question 4",
    "Which of the following can help us make a new line in HTML",
    [
        "<br>",
        "<new>",
        "<return>",
        "\\r"
    ],
    0,
    "'Gimme a break!'",
    "https://www.w3schools.com/tags/tag_br.asp",
    "HTML"
)

let htmlQuestion5 = new quizQuestion(
    "Question 5",
    "Any element can be given a data attribute by adding which of the following:",
    [
        "data: attribute",
        "[data] = [attribute]",
        "data-attribute = 'property'",
        "dataset.property"
    ],
    2,
    "A prefix lets the browser know this is a data attribute",
    "https://www.w3schools.com/tags/att_data-.asp",
    "HTML"
)

let htmlQuestion6 = new quizQuestion(
    "Question 6",
    "In VSCode, these typed shortcuts can be used to auto-fill your HTML template",
    [
        "?, give-me-html",
        "html, !",
        "autofill-html, start",
        "begin, ??"
    ],
    1,
    "Here is your hint",
    "N/A",
    "HTML"
)

let htmlQuestion7 = new quizQuestion(
    "Question 7",
    "What is the correct tag for an unordered list?",
    [
        "<uol>",
        "<ol>",
        "<ulist>",
        "<ul>"
    ],
    3,
    "It's just two letters",
    "https://www.w3schools.com/tags/tag_ul.asp",
    "HTML"
)
let htmlQuestion8 = new quizQuestion(
    "Question 8",
    "You can access this in a browser to see the website's code",
    [
        "Bookmarks",
        "See more...",
        "DevTools",
        "WebView"
    ],
    2,
    "Tricks of the 'trade'",
    "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools",
    "HTML"
)
let htmlQuestion9 = new quizQuestion(
    "Question 9",
    "We can write comments in HTML using the following symbols",
    [
        "//",
        "<!--    -->",
        "/*    */",
        "Comment: "
    ],
    1,
    "All HTML comments are enthusiastic",
    "https://www.w3schools.com/html/html_comments.asp",
    "HTML"
)
let htmlQuestion10 = new quizQuestion(
    "Question 10",
    "Which attributes can we add to links?",
    [
        "href, title, target",
        "src, alt, href",
        "source, redirect, image",
        "ref, snapto, tooltip"
    ],
    0,
    "One of these attributes allows us to control whether the link opens in the same window or a new tab",
    "https://www.w3schools.com/html/html_links.asp",
    "HTML"
)
let htmlQuestion11 = new quizQuestion(
    "Question 11",
    "An easy way to link HTML elements to CSS and javascript is by referencing attributes, such as:",
    [
        "#id or .class",
        "-min or -max",
        "<header>, <main>, and <footer>",
        "!DOCTYPE"
    ],
    0,
    "One is unique, one is not",
    "https://www.w3schools.com/tags/ref_attributes.asp",
    "HTML"
)
let htmlQuestion12 = new quizQuestion(
    "Question 12",
    "What does this emmet string output?\ndiv>ul>li.hello*3\n\nChoose the most correct answer",
    [
        "3 lists, 1 unordered list, and a div",
        "1 div, an ordered list, and 3 list items inside",
        "1 div, an unordered list, and 3 list items inside",
        "1 div, an unordered list, and 3 list items with the class 'hello' inside"
    ],
    3,
    "Emmet uses similar annotation to CSS selectors",
    "https://docs.emmet.io/cheat-sheet/",
    "HTML"
)
let htmlQuestion13 = new quizQuestion(
    "Question 13",
    "What is the proper syntax for linking a cascading stylesheet",
    [
        "<style sheet='./style.css'>",
        "<link rel='stylesheet' href='./style.css'>",
        "<meta stylesheet='./style.css'>",
        "<link rel='./style.css'>"
    ],
    1,
    "Here is your hint",
    "https://www.w3schools.com/css/css_howto.asp",
    "HTML"
)
let htmlQuestion14 = new quizQuestion(
    "Question 14",
    "This semantic element allows for users to enter multiple lines of text",
    [
        "<text></text>",
        "<span></span>",
        "<p></p>",
        "<textarea><textarea>"
    ],
    3,
    "This can take up a large area",
    "https://www.w3schools.com/tags/tag_textarea.asp",
    "HTML"
)
let htmlQuestion15 = new quizQuestion(
    "Question 15",
    "What element allows users to select items from a dropdown menu",
    [
        "<input type='dropdown' />",
        "<label>, <select>, and <option> together",
        "<list></list>",
        "All of the above"
    ],
    1,
    "We have to give it a name, dropdown, and items",
    "https://www.w3schools.com/tags/tag_select.asp",
    "HTML"
)
let htmlQuestion16 = new quizQuestion(
    "Question 16",
    "Which of the following can be used for counting or incrementing list items.",
    [
        "<ul>",
        "<ol>",
        "<uol>",
        "<list>"
    ],
    1,
    "Order!",
    "https://www.w3schools.com/html/html_lists_ordered.asp",
    "HTML"
)
let htmlQuestion17 = new quizQuestion(
    "Question 17",
    "This is the name of the icon used for your webpage's tab in the browser",
    [
        "favoriteIcon.png",
        "browserIcon.ico",
        "favicon.ico",
        "browsicon.ico"
    ],
    2,
    "It's my fave",
    "https://favicon.io/",
    "HTML"
)
let htmlQuestion18 = new quizQuestion(
    "Question 18",
    "This is where we might include information about the website such as contact or site info, or links to resources and credits.",
    [
        "<footer></footer>",
        "<foot></foot>",
        "<p></p>",
        "<info></info>"
    ],
    0,
    "Opposite of the <header> element",
    "https://www.w3schools.com/tags/tag_footer.asp",
    "HTML"
)
let htmlQuestion19 = new quizQuestion(
    "Question 19",
    "This is the correct way to add a link to an image",
    [
        "<a><img></a>",
        "<img><a></img>",
        "<div img><a></a>",
        "<a><img>"
    ],
    0,
    "Wrap it up!",
    "https://www.w3schools.com/tags/tryit.asp?filename=tryhtml_image_link",
    "HTML"
)
let htmlQuestion20 = new quizQuestion(
    "Question 20",
    "You can set a default URL for the links on your site using which tag",
    [
        "<link>",
        "<base>",
        "<href>",
        "<a>"
    ],
    3,
    "Acts as a basis for all other links",
    "https://www.w3schools.com/tags/tag_base.asp",
    "HTML"
)

// JavaScript Questions
let jsQuestion1 = new quizQuestion(
    "Question 1",
    "This type of declaration implies the value of the variable does NOT change.",
    [
        "var ratio;",
        "let ratio = 0;",
        "const ratio = 2.5;",
        "if ratio == 2.5 !change"
    ],
    2,
    "This is a constant reminder...",
    "https://www.w3schools.com/js/js_const.asp",
    "JavaScript"
)

let jsQuestion2 = new quizQuestion(
    "Question 2",
    "What does the following code produce?\n\nlet number = 0;\nfor(let i = 0; i < 10; i++) {\n\tnumber += i\n}\nconsole.log(number);",
    [
        "0123456789",
        "0",
        "45",
        "iiiiiiiiii"
    ],
    2,
    "for repeats the code inside until the counter == 10",
    "https://www.w3schools.com/js/js_loop_for.asp",
    "JavaScript"
)

let jsQuestion3 = new quizQuestion(
    "Question 3",
    "This type of conditional does one thing if true, or another thing if something else is true",
    [
        "if/else",
        "if/else if",
        "while",
        "for"
    ],
    1,
    "Specific conditions must be met",
    "https://www.w3schools.com/js/js_if_else.asp",
    "JavaScript"
)

let jsQuestion4 = new quizQuestion(
    "Question 4",
    "This type of conditional will continue to run whilst its condition is true",
    [
        "if/else",
        "if/else if",
        "while",
        "for"
    ],
    2,
    "whilst is your hint :)",
    "https://www.w3schools.com/js/js_loop_while.asp",
    "JavaScript"
)

let jsQuestion5 = new quizQuestion(
    "Question 5",
    "This condition takes in 3 arguments and will iterate until its counter meets a specified condition",
    [
        "if/else",
        "if/else if",
        "while",
        "for"
    ],
    3,
    "(let i = 0; i < ourCounter; i++)",
    "https://www.w3schools.com/js/js_loop_for.asp",
    "JavaScript"
)

let jsQuestion6 = new quizQuestion(
    "Question 6",
    "When declaring the following function:\n\n function(p1, p2, p3){\n\n}\nWhat are p1, p2, and p3 called?",
    [
        "Arguments",
        "Parenthetical Documentation",
        "Parameters",
        "Parts"
    ],
    2,
    "Here is your hint",
    "https://www.w3schools.com/js/js_function_parameters.asp",
    "JavaScript"
)

let jsQuestion7 = new quizQuestion(
    "Question 7",
    "Each of these can be used to remove elements from an array.",
    [
        "slice(), dice(), front(), back()",
        "shift(), pop(), splice(), delete",
        "unshift(), push(), slice()",
        "return, break, continue"
    ],
    1,
    "There are many different ways to do this!",
    "https://www.w3schools.com/js/js_array_methods.asp",
    "JavaScript"
)
let jsQuestion8 = new quizQuestion(
    "Question 8",
    "The following code can be used to find a random number greater than 0 and less than max",
    [
        "Math.random(Math.floor() * max)",
        "max(Math.floor(Math.random()))",
        "Math.floor(Math.random() * max)",
        "max(Math.random() * Math.floor())"
    ],
    2,
    "We need to round down the product of 0-1 and max",
    "https://www.w3schools.com/js/js_random.asp",
    "JavaScript"
)
let jsQuestion9 = new quizQuestion(
    "Question 9",
    "Which of the following values is NOT false",
    [
        "!true",
        "NaN",
        "0",
        "'false'"
    ],
    3,
    "Only empty strings are falsy",
    "https://developer.mozilla.org/en-US/docs/Glossary/Falsy",
    "JavaScript"
)
let jsQuestion10 = new quizQuestion(
    "Question 10",
    "Each of these can be used to add elements to an array.",
    [
        "slice(), dice(), front(), back()",
        "shift(), pop(), splice(), delete",
        "unshift(), push(), splice()",
        "return, break, continue"
    ],
    2,
    "It's UNacceptable to budge at the front, just push your way to the back of the line.",
    "https://www.geeksforgeeks.org/what-is-the-difference-between-unshift-and-push-method-in-javascript/",
    "JavaScript"
)
let jsQuestion11 = new quizQuestion(
    "Question 11",
    "What does the following return?\n\nlet myString = 'abcdefgh';\nmyString.includes('cdef');",
    [
        "false",
        "cdef",
        "abgh",
        "true"
    ],
    1,
    "Here is your hint",
    "https://www.w3schools.com/JSREF/jsref_includes.asp",
    "JavaScript"
)
let jsQuestion12 = new quizQuestion(
    "Question 12",
    "If myString = 'The Lone Rangers', how would we return the letter 's'?",
    [
        "myString.indexOf(s)",
        "myString.charAt(myString.length)",
        "myString.charAt(myString.length - 1)",
        "myString.charAt(last)"
    ],
    2,
    "The string length != last index",
    "https://www.w3schools.com/jsref/jsref_charat.asp",
    "JavaScript"
)
let jsQuestion13 = new quizQuestion(
    "Question 13",
    "The following events can be added as event listeners to HTML objects.",
    [
        "lookedat, lookback, lookforward",
        "mouseenter, mouseleave, click",
        "hover, focus, mousein",
        "display, hide, animate"
    ],
    1,
    "How do users mostly interact with webpages?",
    "https://www.w3schools.com/jsref/met_element_addeventlistener.asp",
    "JavaScript"
)
let jsQuestion14 = new quizQuestion(
    "Question 14",
    "Variables can easily be added into strings by using backticks using template literals.  What is the proper syntax for doing so?",
    [
        "\`${ourVariable}\`",
        "\`{$ourVariable}\`",
        "\`$ourVariable\`",
        "\`$ourVariable$\`"
    ],
    3,
    "TIL what these are called (psst, look at the acronym TIL)",
    "https://www.w3schools.com/js/js_string_templates.asp",
    "JavaScript"
)
let jsQuestion15 = new quizQuestion(
    "Question 15",
    "These methods can be used on strings to convert them to all lowercase or all uppercase:",
    [
        "little(), bigify()",
        "tolowercase(), touppercase()",
        "toLowerCase(), toUpperCase()",
        "makeLower(), makeUpper()"
    ],
    2,
    "camelCase",
    "https://www.w3schools.com/jsref/jsref_tolowercase.asp",
    "JavaScript"
)
let jsQuestion16 = new quizQuestion(
    "Question 16",
    "What is the correct 'for loop' syntax?",
    [
        "for(i++, i < myArray.length, i = 0){\n}",
        "for(let i = 0 < myArray.length < i++){\n}",
        "for(if i === true; i++){\n}",
        "for(let i = 0; i < myArray.length; i++){\n}"
    ],
    3,
    "3 parts to declaring a for loop: Initialize, check condition, increment",
    "https://www.w3schools.com/js/js_loop_for.asp",
    "JavaScript"
)
let jsQuestion17 = new quizQuestion(
    "Question 17",
    "What does the following code output:\nlet var;\n\n if(var > 0){\n\treturn true;\n}",
    [
        "True",
        "False",
        "BUG! That code won't run!",
        "'var'"
    ],
    3,
    "Is var defined?",
    "https://www.w3schools.com/js/js_variables.asp",
    "JavaScript"
)
let jsQuestion18 = new quizQuestion(
    "Question 18",
    "In JavaScript, 'document' refers to what?",
    [
        "'./script.js.",
        "The HTML DOM Document object",
        "A comment",
        "A Github README"
    ],
    1,
    "document.querySelector('') is one way to access the 'document'",
    "https://www.w3schools.com/js/js_htmldom_document.asp",
    "JavaScript"
)
let jsQuestion19 = new quizQuestion(
    "Question 19",
    "This powerful array method can both remove and add elements to arrays",
    [
        "splice()",
        "slice()",
        "thrice()",
        "addRemove()"
    ],
    3,
    "The answer rhymes with two other choices ;)",
    "https://www.javascripttutorial.net/javascript-array-splice/",
    "JavaScript"
)
let jsQuestion20 = new quizQuestion(
    "Question 20",
    "True or False: Boolean has just two values, true and false",
    [
        "!!!true",
        "let TRUE = false;\nreturn TRUE;",
        "!false",
        "frue"
    ],
    2,
    "True!",
    "https://www.w3schools.com/jsref/jsref_obj_boolean.asp",
    "JavaScript"
)

// CSS Questions
let cssQuestion1 = new quizQuestion(
    "Question 1",
    "What does the 'a' in rgba(255, 255, 255, 1) stand for?",
    [
        "Alpha",
        "Anti-saturation",
        "After",
        "Axis"
    ],
    0,
    "This component helps control transparency of the color",
    "https://www.w3schools.com/cssref/func_rgba.php",
    "CSS"
)

let cssQuestion2 = new quizQuestion(
    "Question 2",
    "The '.' selector in .div is a selector for:",
    [
        "id",
        "class",
        "child",
        "parent"
    ],
    1,
    "This is assigned in your HTML",
    "https://www.w3schools.com/css/css_selectors.asp",
    "CSS"
)

let cssQuestion3 = new quizQuestion(
    "Question 3",
    "The '#' selector in #div is a selector for:",
    [
        "id",
        "class",
        "child",
        "parent"
    ],
    0,
    "This is assigned in your HTML",
    "https://www.w3schools.com/css/css_selectors.asp",
    "CSS"
)

let cssQuestion4 = new quizQuestion(
    "Question 4",
    "Choose the following correct syntax for setting a border:",
    [
        "1px border('red');",
        "border: 1px solid chartreuse;",
        "border-radius: 3px;",
        "border-shadow: 1px solid red;"
    ],
    3,
    "The box-shadow property is used to set shadows",
    "https://www.w3schools.com/css/css_border_shorthand.asp",
    "CSS"
)

let cssQuestion5 = new quizQuestion(
    "Question 5",
    "We can make a circle by setting border-radius to ____",
    [
        "0",
        "5px",
        "Half the width",
        "50%"
    ],
    3,
    "It's a coin flip",
    "https://css-tricks.com/almanac/properties/b/border-radius/",
    "CSS"
)

let cssQuestion6 = new quizQuestion(
    "Question 6",
    "I'm question #6, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)

let cssQuestion7 = new quizQuestion(
    "Question 7",
    "I'm question #7, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion8 = new quizQuestion(
    "Question 8",
    "I'm question #8, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion9 = new quizQuestion(
    "Question 9",
    "I'm question #9, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion10 = new quizQuestion(
    "Question 10",
    "I'm question #10, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion11 = new quizQuestion(
    "Question 11",
    "I'm question #11, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion12 = new quizQuestion(
    "Question 12",
    "I'm question #12, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion13 = new quizQuestion(
    "Question 13",
    "I'm question #13, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion14 = new quizQuestion(
    "Question 14",
    "I'm question #14, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion15 = new quizQuestion(
    "Question 15",
    "I'm question #15, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion16 = new quizQuestion(
    "Question 16",
    "I'm question #16, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion17 = new quizQuestion(
    "Question 17",
    "I'm question #17, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion18 = new quizQuestion(
    "Question 18",
    "I'm question #18, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion19 = new quizQuestion(
    "Question 19",
    "I'm question #19, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)
let cssQuestion20 = new quizQuestion(
    "Question 20",
    "I'm question #20, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "CSS"
)

// General Coding Questions
let genQuestion1 = new quizQuestion(
    "Question 1",
    "I'm question #1, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion2 = new quizQuestion(
    "Question 2",
    "I'm question #2, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion3 = new quizQuestion(
    "Question 3",
    "I'm question #3, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion4 = new quizQuestion(
    "Question 4",
    "I'm question #2, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion5 = new quizQuestion(
    "Question 5",
    "I'm question #5, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion6 = new quizQuestion(
    "Question 6",
    "I'm question #6, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let genQuestion7 = new quizQuestion(
    "Question 7",
    "I'm question #7, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion8 = new quizQuestion(
    "Question 8",
    "I'm question #8, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion9 = new quizQuestion(
    "Question 9",
    "I'm question #9, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion10 = new quizQuestion(
    "Question 10",
    "I'm question #10, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion11 = new quizQuestion(
    "Question 11",
    "I'm question #11, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion12 = new quizQuestion(
    "Question 12",
    "I'm question #12, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion13 = new quizQuestion(
    "Question 13",
    "I'm question #13, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion14 = new quizQuestion(
    "Question 14",
    "I'm question #14, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion15 = new quizQuestion(
    "Question 15",
    "I'm question #15, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion16 = new quizQuestion(
    "Question 16",
    "I'm question #16, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion17 = new quizQuestion(
    "Question 17",
    "I'm question #17, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion18 = new quizQuestion(
    "Question 18",
    "I'm question #18, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion19 = new quizQuestion(
    "Question 19",
    "I'm question #19, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)
let genQuestion20 = new quizQuestion(
    "Question 20",
    "I'm question #20, practice typing with me.",
    [
        "Answer 1",
        "Answer 2",
        "Answer 3",
        "Answer 4"
    ],
    3,
    "Here is your hint",
    "Google Link",
    "General"
)

let htmlQuestions = [htmlQuestion1, htmlQuestion2, htmlQuestion3, htmlQuestion4, htmlQuestion5, htmlQuestion6, htmlQuestion7, htmlQuestion8, htmlQuestion9, htmlQuestion10,
    htmlQuestion11, htmlQuestion12, htmlQuestion13, htmlQuestion14, htmlQuestion15, htmlQuestion16, htmlQuestion17, htmlQuestion18, htmlQuestion19, htmlQuestion20];

let jsQuestions = [jsQuestion1, jsQuestion2, jsQuestion3, jsQuestion4, jsQuestion5, jsQuestion6, jsQuestion7, jsQuestion8, jsQuestion9, jsQuestion10, jsQuestion11, jsQuestion12,
    jsQuestion13, jsQuestion14, jsQuestion15, jsQuestion16, jsQuestion17, jsQuestion18, jsQuestion19, jsQuestion20];
  
let cssQuestions = [cssQuestion1, cssQuestion2, cssQuestion3, cssQuestion4, cssQuestion5, cssQuestion6, cssQuestion7, cssQuestion8, cssQuestion9, cssQuestion10, cssQuestion11, cssQuestion12,
    cssQuestion13, cssQuestion14, cssQuestion15, cssQuestion16, cssQuestion17, cssQuestion18, cssQuestion19, cssQuestion20];

let genQuestions = [genQuestion1, genQuestion2, genQuestion3, genQuestion4, genQuestion5, genQuestion6, genQuestion7, genQuestion8, genQuestion9, genQuestion10, genQuestion11, genQuestion12,
    genQuestion13, genQuestion14, genQuestion15, genQuestion16, genQuestion17, genQuestion18, genQuestion19, genQuestion20];