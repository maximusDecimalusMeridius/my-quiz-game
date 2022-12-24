// Latching onto our HTML friends
let colorCheckboxNodes = document.getElementsByClassName("colorCheckbox");               //Color checkboxes for users to choose the text color;
let quizContainerNode = document.getElementById("quiz-container");         //Main quiz container and window
let quizQuestionNode = document.getElementById("quiz-question");       //Quiz Question where most of the content populates
let prevButton = document.getElementById("prev-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let submitButton = document.getElementById("submit-button");           //Submit button that displays inside of the quiz question node when called (display none/block)
let quizHeaderStatusNode = document.getElementById("quiz-header-status");   //Pop up in the quiz window that will display various status messages

let quizDeck = [];

// Event listeners to make answer options glow on mouseover with delegation
quizContainerNode.addEventListener("mouseover", (event) => {
    if(event.target.className === "answer-option" && submitButton.dataset.gameMode === "game"){
        event.target.setAttribute("style", "box-shadow: inset 0px 0px 4px 4px var(--amaranth-red);");
    }
});

quizContainerNode.addEventListener("mouseout", (event) => {
    if(event.target.className === "answer-option"){
        event.target.setAttribute("style", "box-shadow: 0px;");
    }
});              

for(let i = 0; i < colorCheckboxNodes.length; i++){
    
    colorCheckboxNodes[i].addEventListener("click", (event) => {
        
        for(let j = 0; j < colorCheckboxNodes.length; j++){
            colorCheckboxNodes[j].checked = false;
            console.log(event);
            colorCheckboxNodes[j].parentNode.lastChild.setAttribute("style","left: 0px;");
        }
        event.target.checked = true;
        quizQuestionNode.setAttribute("style",`color: ${event.target.value}`)
        event.target.parentNode.lastChild.setAttribute("style","left: 24px;");
        console.log(event);
    })
}

// Typewriter function to display text like a typewriter
function typeWriter(textToDisplay){
 
    let typeSpeed = 25;
    let typedContent = "";
    let loopCounter = 0;
    console.log("Ran typeWriter()");
    //if typedContent is "" flash a blank cursor
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

function startQuiz(){
    randomQuestion();
    popUpStatus();
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
    randomizeDeck(htmlQuestions, randomNumber(7));                // Why can't I deconstruct a returned array from the randomizeDeck function?
    randomizeDeck(jsQuestions, randomNumber(7));
    randomizeDeck(cssQuestions, randomNumber(7));
    randomizeDeck(generalQuestions, randomNumber(7));
}

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
    htmlQuestions = [...randomizedDeck];
    randomizeDeck(htmlQuestions, flag-1);
    }
}
    
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

let htmlQuestions = [htmlQuestion1, htmlQuestion2, htmlQuestion3, htmlQuestion4, htmlQuestion5, htmlQuestion6, htmlQuestion7, htmlQuestion8, htmlQuestion9, htmlQuestion10,
    htmlQuestion11, htmlQuestion12, htmlQuestion13, htmlQuestion14, htmlQuestion15, htmlQuestion16, htmlQuestion17, htmlQuestion18, htmlQuestion19, htmlQuestion20];

let jsQuestions = [jsQuestion1, jsQuestion2, jsQuestion3, jsQuestion4, jsQuestion5, jsQuestion6, jsQuestion7, jsQuestion8, jsQuestion9, jsQuestion10, jsQuestion11, jsQuestion12,
  jsQuestion13, jsQuestion14, jsQuestion15, jsQuestion16, jsQuestion17, jsQuestion18, jsQuestion19, jsQuestion20];      