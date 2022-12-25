// Latching onto our HTML friends
let colorMenuItemNodes = document.getElementsByClassName("color-menu-items");
let colorCheckboxNodes = document.getElementsByClassName("colorCheckbox");               //Color checkboxes for users to choose the text color;
let welcomeMessageNode = document.getElementById("welcome-message");          //Welcome message window
let rangeBoxes = document.getElementsByClassName("ranges");                   //Range sliders in quiz intro for selecting number of questions
let quizContainerNode = document.getElementById("quiz-container");         //Main quiz container and window
let quizQuestionNode = document.getElementById("quiz-question");       //Quiz Question where most of the content populates
let prevButton = document.getElementById("prev-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let submitButton = document.getElementById("submit-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let quizHeaderStatusNode = document.getElementById("quiz-header-status");   //Pop up in the quiz window that will display various status messages

let quizDeck = [];

// Event listeners to make answer options glow on mouseover with delegation
quizContainerNode.addEventListener("mouseover", (event) => {
    console.log(event.target);
    if(event.target.className === "answer-option" && submitButton.dataset.gameMode === "game"){
        event.target.setAttribute("style", "box-shadow: inset 0px 0px 4px 4px red");
    }
});

quizContainerNode.addEventListener("mouseout", (event) => {
    if(event.target.className === "answer-option" && (event.target.dataset.selected != true)){
        event.target.setAttribute("style", "box-shadow: 0px;");
    }
});

quizContainerNode.addEventListener("click", (event) => {
    if(event.target.className === "answer-option"){
        event.target.setAttribute("style", "border: 2px solid blue");
        event.target.setAttribute("dataset", "selected: true");
    }
})

welcomeMessageNode.addEventListener("input", (event) => {
    
    if(event.target.className == "ranges"){
        event.target.nextSibling.innerText = event.target.value;
    }
})

welcomeMessageNode.addEventListener("change", (event) => {
    let sum = 0;
    
    if(event.target.className == "ranges"){
        for(let i = 0; i < 4; i++){
            sum = sum + parseInt(rangeBoxes[i].value);
        }
        console.log(sum);
    }
})

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
            } else 
            
            if(placementRandomizer === 0 && pullRandomizer === 1){
                randomizedDeck.unshift(deck.pop());
            } else

            if(placementRandomizer === 1 && pullRandomizer === 0){
                randomizedDeck.push(deck.shift());
            } else

            if(placementRandomizer === 1 && pullRandomizer === 1){
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

function startQuiz(){
    welcomeMessageNode.setAttribute("style", "display: none");
    randomQuestion();
    popUpStatus();
    console.log(quizDeck);
    console.log("The deck has been loaded");
}

function randomQuestion() {
    submitButton.innerText = "Next";
    typeWriter(htmlQuestions[Math.floor(Math.random() * htmlQuestions.length)].content);
}

function randomNumber(num){
    return (Math.floor(Math.random() * num));
}

function buildDeck() {
    
    let numOfQuestions = 10;
    let gameDeck = [];

    for(let i = 0; i < numOfQuestions; i++){
        
    }
}

function randomizer(){
    randomizeDeck(htmlQuestions, randomNumber(7));
    randomizeDeck(jsQuestions, randomNumber(7));
    randomizeDeck(cssQuestions, randomNumber(7));
    randomizeDeck(genQuestions, randomNumber(7));
}

// Function to randomize the deck passed in arguments and shuffles the random deck shuffles times
    
function popUpStatus() {
    
    if(submitButton.dataset.gameMode != "intro"){
        quizHeaderStatusNode.setAttribute("style", "bottom: 30px");
        submitButton.disabled = true;
        prevButton.disabled = true;
    } else { 
        
        submitButton.dataset.gameMode = "game";
        submitButton.disabled = true;
        prevButton.disabled = true;
        let timeOut = setTimeout(() => {
            submitButton.disabled = "";
            prevButton.disabled = "";
        }, 2000);
    }
    
    let timeOut = setTimeout(() =>{
        quizHeaderStatusNode.setAttribute("style", "bottom: -20px");
        submitButton.disabled = "";
        prevButton.disabled = "";
    }, 2000);
    
}


// Event listener for the submit button to update the start button for the quiz
// and display prevButton
submitButton.addEventListener("click", (event) => {
    event.preventDefault;
    if(submitButton.innerText === "Start!"){
        prevButton.setAttribute("style", "display: block;")
        submitButton.innerText = "Next";
    }
    randomizer();
    startQuiz();
    
});



























// Quiz question class
class quizQuestion {
    constructor(title, content, answers, answerIndex, hint, googleLink, techdocLink){
        this.title = title;
        this.content = content;
        this.answers = answers;
        this.answerIndex = answerIndex;
        this.hint = hint;
        this.googleLink = googleLink;
        this.techdocLink = techdocLink;
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
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
    "TechDocLink"
)

let htmlQuestions = [htmlQuestion1, htmlQuestion2, htmlQuestion3, htmlQuestion4, htmlQuestion5, htmlQuestion6, htmlQuestion7, htmlQuestion8, htmlQuestion9, htmlQuestion10,
    htmlQuestion11, htmlQuestion12, htmlQuestion13, htmlQuestion14, htmlQuestion15, htmlQuestion16, htmlQuestion17, htmlQuestion18, htmlQuestion19, htmlQuestion20];

let jsQuestions = [jsQuestion1, jsQuestion2, jsQuestion3, jsQuestion4, jsQuestion5, jsQuestion6, jsQuestion7, jsQuestion8, jsQuestion9, jsQuestion10, jsQuestion11, jsQuestion12,
    jsQuestion13, jsQuestion14, jsQuestion15, jsQuestion16, jsQuestion17, jsQuestion18, jsQuestion19, jsQuestion20];
  
let cssQuestions = [cssQuestion1, cssQuestion2, cssQuestion3, cssQuestion4, cssQuestion5, cssQuestion6, cssQuestion7, cssQuestion8, cssQuestion9, cssQuestion10, cssQuestion11, cssQuestion12,
    cssQuestion13, cssQuestion14, cssQuestion15, cssQuestion16, cssQuestion17, cssQuestion18, cssQuestion19, cssQuestion20];

let genQuestions = [genQuestion1, genQuestion2, genQuestion3, genQuestion4, genQuestion5, genQuestion6, genQuestion7, genQuestion8, genQuestion9, genQuestion10, genQuestion11, genQuestion12,
    genQuestion13, genQuestion14, genQuestion15, genQuestion16, genQuestion17, genQuestion18, genQuestion19, genQuestion20];