// Latching onto our HTML friends
let welcomeMessageNode = document.getElementById("welcome-message");          //Welcome message window
let quizContainerNode = document.getElementById("quiz-container");         //Main quiz container and window
let quizQuestionNode = document.getElementById("quiz-question-text");       //Quiz Question where most of the content populates
let quizQuestionTitleNode = document.getElementById("quiz-header-title");   //Welcome title and "Question" title
let prevButton = document.getElementById("prev-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let submitButton = document.getElementById("submit-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let quizHeaderStatusNode = document.getElementById("quiz-header-status");   //Pop up in the quiz window that will display various status messages

let colorMenuItemNodes = document.getElementsByClassName("color-menu-items");       //Divs that hold the check boxes and bubbles for color switching
let colorCheckboxNodes = document.getElementsByClassName("colorCheckbox");               //Color checkboxes for users to choose the text color;
let rangeBoxes = document.getElementsByClassName("ranges");                   //Range sliders in quiz intro for selecting number of questions
let answerNodes = document.getElementsByClassName("answer-options");
let sumNode = document.getElementById("sumNode");                                   //Sum of questions user will receive

let quizDeck = [];
let playerDeck = [];
let deckCounter = 0;
let answerArray = [];

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
    if(event.target.className === "answer-options"){
        if(event.target.style.fontWeight != "bold"){
            for(let i = 0; i < answerNodes.length; i++){
                answerNodes[i].setAttribute("style", "font-weight: none; background-color: white; color: black;");
                answerNodes[i].dataset.selected = "false";
            }
            event.target.setAttribute("style", "font-weight: bold; background-color: rgb(76 12 89); color: white;");
            event.target.dataset.selected = "true";
        } else {
            event.target.setAttribute("style", "font-weight: none; background-color: white; color: black;");
            event.target.dataset.selected = "false";
        }
    }
    
});

welcomeMessageNode.addEventListener("input", (event) => {
    
    if(event.target.className == "ranges"){
        event.target.nextSibling.innerText = event.target.value;
        sumNode.innerText = addEmUp();
    }
})

// Function to get all values from the ranges on HTML, add them up, and output them to the screen
// in real-time
function addEmUp() {
    let sum = 0;
        for(let i = 0; i < 4; i++){
            sum = sum + parseInt(rangeBoxes[i].value);
        }
    return sum;
}

// Add event listeners to all the checkboxes
for(let i = 0; i < colorMenuItemNodes.length; i++){
    
    colorMenuItemNodes[i].addEventListener("click", (event) => {
        let checkboxChild;
        let bubbleChild;
        
        // Setting checkbox and bubble values based on where user clicks
        // Initial bug found clicking on edge of box did not activate scritps because node assignments
        // were misaligned
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

// Typewriter function to display text like a typewriter
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

// Recursively randomize the deck passed in arguments and shuffle it as many times as shuffles argument;
// Randomizers decide which ends to pull data off of arrays and how to place them (front vs. back)
// Final output is set to quizDeck global variable
function randomizeDeck(inputDeck, shuffles) {
    let flag = shuffles;
    let deck = [...inputDeck];
    let randomizedDeck = [];
    let placementRandomizer, pullRandomizer = 0;
    
    if(flag != 0){
        for(let i = 0; i < 20; i++){
            placementRandomizer = randomNumber(2);
            pullRandomizer = randomNumber(2);
            
            if(placementRandomizer === 0 && pullRandomizer === 0){
                randomizedDeck.push(deck.pop());
            } else if(placementRandomizer === 0 && pullRandomizer === 1){
                randomizedDeck.unshift(deck.pop());
            } else if(placementRandomizer === 1 && pullRandomizer === 0){
                randomizedDeck.push(deck.shift());
            } else if(placementRandomizer === 1 && pullRandomizer === 1){
                {randomizedDeck.unshift(deck.shift())}
            }
        }
    deck = [...randomizedDeck];
    randomizeDeck(deck, flag-1);
        return;
    }
    for(let i = 0; i < deck.length; i++){
        quizDeck.push(deck[i]);
    }
}

// Function to calculate a random number
function randomNumber(num){
    return (Math.floor(Math.random() * num));
}

// Function to build the final deck once the user has submitted their desired number of questions
function buildDeck(sum) {
    let numOfQuestions = sum;
    let placementRandomizer, pullRandomizer = 0;
    while(numOfQuestions > 0){
        placementRandomizer = randomNumber(2);
        pullRandomizer = randomNumber(2);
        
        if(placementRandomizer === 0 && pullRandomizer === 0){
            playerDeck.push(quizDeck.pop());
        } else if(placementRandomizer === 0 && pullRandomizer === 1){
            playerDeck.unshift(quizDeck.pop());
        } else if(placementRandomizer === 1 && pullRandomizer === 0){
            playerDeck.push(quizDeck.shift());
        } else if(placementRandomizer === 1 && pullRandomizer === 1){
            playerDeck.unshift(quizDeck.shift())
        }
        numOfQuestions--;
    }

}

//Randomizing all decks and adding to final deck
//replace with function to take selection from user
function randomizer(){
    randomizeDeck(htmlQuestions, randomNumber(7));
    randomizeDeck(jsQuestions, randomNumber(7));
    randomizeDeck(cssQuestions, randomNumber(7));
    randomizeDeck(genQuestions, randomNumber(7));
}

// Function to randomize the deck passed in arguments and shuffles the random deck shuffles times

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
            
function startQuiz(){
    welcomeMessageNode.setAttribute("style", "display: none");
}

function drawCard(deck){
    
    if(deckCounter < deck.length){
        let currentQuestion = deck[deckCounter];
        popUpStatus();
        quizQuestionTitleNode.innerText = `Question ${deckCounter + 1} / ${playerDeck.length}`;
        typeWriter(currentQuestion.content);
        answerNodes[0].innerText = currentQuestion.answers[0];
        answerNodes[1].innerText = currentQuestion.answers[1];
        answerNodes[2].innerText = currentQuestion.answers[2];
        answerNodes[3].innerText = currentQuestion.answers[3];  
        popUpStatus(currentQuestion.language);
        //Start question timer
    }
}

function grader(indexOfLastQuestion) {
    let compareArray = [];
    
    for(let i = 0; i < 4; i++){
        if(answerNodes[i].dataset.selected === "true"){
            compareArray.push(i);           //this is the user selected value
            compareArray.push(quizDeck[i].answerIndex);             //this is the correct answer
        }
        answerNodes[i].dataset.selected = "false";
        answerNodes[i].setAttribute("style", "font-weight: none; background-color: white; color: black;");
    }
    deckCounter++;
    answerArray.push(compareArray);
}

function finishGame(){
    //Calculate and display stats

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
        prevButton.setAttribute("style", "display: block;")
        submitButton.dataset.gameMode = "game"
        submitButton.innerText = "Next";
        randomizer();
        buildDeck(addEmUp());
        startQuiz();
        drawCard(quizDeck);
    } else if (deckCounter < playerDeck.length - 1){
        grader(deckCounter);                        //check grades and increment deck counter;
        drawCard(quizDeck);
    } else {
        grader(deckCounter);
        finishGame();
        alert("thanks for playing!");
    }
});



























// Quiz question class
class quizQuestion {
    constructor(title, content, answers, answerIndex, hint, googleLink, language){
        this.title = title;
        this.content = content;
        this.answers = answers;
        this.answerIndex = answerIndex;
        this.hint = hint;
        this.googleLink = googleLink;
        this.language = language;
    }
}

let htmlQuestion1 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion2 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion3 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion4 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion5 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion6 = new quizQuestion(
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
    "HTML"
)

let htmlQuestion7 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion8 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion9 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion10 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion11 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion12 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion13 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion14 = new quizQuestion(
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
    "HTML"
)
let htmlQuestion15 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion2 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion3 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion4 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion5 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion6 = new quizQuestion(
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
    "JavaScript"
)

let jsQuestion7 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion8 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion9 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion10 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion11 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion12 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion13 = new quizQuestion(
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
    "JavaScript"
)
let jsQuestion14 = new quizQuestion(
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