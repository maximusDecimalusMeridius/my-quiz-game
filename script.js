// Latching onto our HTML friends
// ID elements
let questionSelectNode = document.getElementById("question-select");          //Welcome message window
let quizContainerNode = document.getElementById("quiz-container");         //Main quiz container and window
let quizQuestionNode = document.getElementById("quiz-question-text");       //Quiz Question where most of the content populates
let quizQuestionTitleNode = document.getElementById("quiz-header-title");   //Welcome title and "Question" title
let prevButton = document.getElementById("prev-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let submitButton = document.getElementById("submit-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let quizHeaderStatusNode = document.getElementById("quiz-header-status");   //Pop up in the quiz window that will display various status messages

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
        event.target.setAttribute("style", "box-shadow: inset 0px 0px 4px 0px rgb(76 12 89)");
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
        console.log(playerDeck[i]);
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
    if(answerArray[deckCounter] != undefined) {
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
            compareArray.push(i);                                   //this is the user selected value
            somethingSelected = true;
        }
    }
    if(somethingSelected === false){
        compareArray.push("");                                      //push a blank space if no answers are selected
    }
    
    compareArray.push(playerDeck[indexOfGradedQuestion].answerIndex);
    answerArray[indexOfGradedQuestion] = compareArray;
    console.log(answerArray);
    clearAnswers();
}

// Pop up manager displays the question.language for the question displayed
function popUpStatus(message) {

    quizHeaderStatusNode.innerText = message;
    quizHeaderStatusNode.setAttribute("style", "bottom: 30px");
    submitButton.disabled = true;
    prevButton.disabled = true;

    let timeOut = setTimeout(() =>{
        quizHeaderStatusNode.setAttribute("style", "bottom: -20px");
        submitButton.disabled = "";
        prevButton.disabled = "";
    }, 2000);

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
    prevButton.setAttribute("style", "display: block;")
    submitButton.dataset.gameMode = "game"
    submitButton.innerText = "Next";
}

function finishGame(){
    let unanswered = 0, incorrect = 0, correct = 0;
    
    //Calculate and display stats  **Need to run edge cases on this**
    for(let i = 0; i < answerArray.length; i++){
        if(answerArray[i][1] === ""){
            console.log("unanswered");
            unanswered++;
        } else if (answerArray[i][1] != answerArray[i][2]){
            console.log("not equal");
            incorrect+=1;
        } else if (answerArray[i][1] == answerArray[i][2]) {
            console.log("equal");
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
    if(submitButton.innerText === "Start!"){
        // randomizer(rangeNodes[0].value, rangeNodes[1].value, rangeNodes[2].value, rangeNodes[3].value);
        // buildDeck(rangeNodes[0].value, rangeNodes[1].value, rangeNodes[2].value, rangeNodes[3].value);
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
});

prevButton.addEventListener("click", (event) => {
    event.preventDefault;
    if(deckCounter >= 1){
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
        "data-attribute ='property'",
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
    "HTML"
)
let htmlQuestion17 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion18 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion19 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion20 = new quizQuestion(
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
    "This type of conditional will continue to run whilst its condition is false",
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
    "The following code can be used to find a random number between 0 and max",
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
        "unshift(), push(), join()",
        "return, break, continue"
    ],
    2,
    "Here is your hint",
    "Google Link",
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
    "JavaScript"
)
let jsQuestion16 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion17 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion18 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion19 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion20 = new quizQuestion(
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
    "CSS"
)

let cssQuestion3 = new quizQuestion(
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
    "CSS"
)

let cssQuestion4 = new quizQuestion(
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
    "CSS"
)

let cssQuestion5 = new quizQuestion(
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