const messageInput=document.querySelector(".message-input");
const chatBody=document.querySelector(".chat-body");
const sendMessageButton=document.querySelector("#send-message");
const fileInput=document.querySelector("#file-input");
const fileUploadWrapper=document.querySelector(".file-upload-wrapper");
const fileCancelButton=document.querySelector("#file-cancel");
const micButton=document.querySelector("#mic-button");
const uniqUI = document.querySelector('.uniq-ui');

const API_KEY="AIzaSyCz0d2HTm4sp3kLliT6t1ucaR0EU5MOnVk";
const API_URL= `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const userData={
    message:null,

    file:{
      data:null,
      mime_type:null 
    }
   
}

// create message element with dynamic classes and return it
const createMessageElement=(content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;
}
// generate bot response using API
const generateBotResponse= async(incomingMessageDiv)=>{
    const messageElement=incomingMessageDiv.querySelector(".message-text");
    // API request options
    const requestOptions={
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
           contents:[{
            parts:[{text:userData.message},...(userData.file.data?[{inline_data:userData.file}]:[])]
           }] 
        })
    }
try{
    // api call 
const response=await fetch(API_URL,requestOptions);
const data=await response.json();
if(!response.ok) throw new Error(data.error.message);

// Extract and display bot's response text
const apiResponseText = data.candidates[0].content.parts[0].text.trim();
// Appaly formated to make response clean and readable
let formattedResponse = apiResponseText
  // Bold **text**
  .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")

  // Headings ###, ##, #
  .replace(/^### (.*$)/gim, "<h3>$1</h3>")
  .replace(/^## (.*$)/gim, "<h2>$1</h2>")
  .replace(/^# (.*$)/gim, "<h1>$1</h1>")
  .replace(/^---$/gim, "<hr>")
  // Italics *text*
  .replace(/\*(.*?)\*/g, "<i>$1</i>")

  // Inline code `code`
  .replace(/`(.*?)`/g, "<code>$1</code>")

  // Lists
  .replace(/^\* (.*$)/gim, "<li>$1</li>")
  .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")

  // Line breaks
  .replace(/\n/g, "<br>");
//   this is direct show response
 messageElement.innerHTML=formattedResponse; 

    // TYPE WRITER *******

//  add button here in all chatbot response 
const volumeBtn = document.createElement("button");
volumeBtn.type = "button";
volumeBtn.classList.add("material-symbols-rounded");
volumeBtn.classList.add("bot-speaker")
volumeBtn.innerText = "volume_up";

// Position ke liye parent relative
// incomingMessageDiv.style.position = "relative";
// Append button
messageElement.appendChild(volumeBtn);
// add class list in parent
messageElement.classList.add("has-speaker");

}catch(error){
console.log(error);
messageElement.innerText=error.message;
messageElement.style.color="#ff0000"
}
finally{
    userData.file={};
    incomingMessageDiv.classList.remove("thinking");
     chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"});
}
}

// handle outgoing user message
const handleOutgoingMessage=(e)=>{
    e.preventDefault();
    userData.message=messageInput.value.trim();
    // local storage function ko call
    saveUserMessage(messageInput.value.trim());
    messageInput.value="";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    // create and display user message
    const messageContent=`<div class="message-text"></div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,
    ${userData.file.data}" class="attachment" />`:""}`;

    const outgoingMessageDiv= createMessageElement(messageContent,"user-message");
    outgoingMessageDiv.querySelector(".message-text").textContent=userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"});
   
    // display thinking and loading indicator
    setTimeout(()=>{
        const messageContent=`<svg class="bot-avatar"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
    <path d="M11 8H13C15.8284 8 17.2426 8 18.1213 8.87868C19 9.75736 19 11.1716 19 14C19 16.8284 19 18.2426 18.1213 19.1213C17.2426 20 15.8284 20 13 20H12C12 20 11.5 22 8 22C8 22 9 20.9913 9 19.9827C7.44655 19.9359 6.51998 19.7626 5.87868 19.1213C5 18.2426 5 16.8284 5 14C5 11.1716 5 9.75736 5.87868 8.87868C6.75736 8 8.17157 8 11 8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M19 11.5H19.5C20.4346 11.5 20.9019 11.5 21.25 11.701C21.478 11.8326 21.6674 12.022 21.799 12.25C22 12.5981 22 13.0654 22 14C22 14.9346 22 15.4019 21.799 15.75C21.6674 15.978 21.478 16.1674 21.25 16.299C20.9019 16.5 20.4346 16.5 19.5 16.5H19" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M5 11.5H4.5C3.56538 11.5 3.09808 11.5 2.75 11.701C2.52197 11.8326 2.33261 12.022 2.20096 12.25C2 12.5981 2 13.0654 2 14C2 14.9346 2 15.4019 2.20096 15.75C2.33261 15.978 2.52197 16.1674 2.75 16.299C3.09808 16.5 3.56538 16.5 4.5 16.5H5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path>
    <path d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z" stroke="currentColor" stroke-width="1.5"></path>
    <path d="M12 5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M9 12V13M15 12V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10 16.5C10 16.5 10.6667 17 12 17C13.3333 17 14 16.5 14 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                </svg>
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
        const incomingMessageDiv=createMessageElement(messageContent,"bot-message","thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"});
        generateBotResponse(incomingMessageDiv);
    },600)
}

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown",(e)=>{
    const userMessage=e.target.value.trim();
    if(e.key==="Enter" && userMessage && !e.shiftKey && window.innerWidth > 786){
        handleOutgoingMessage(e);
        e.value="";
    }
});


// Handle file input change and preview the selected file
fileInput.addEventListener("change",()=>{
    const file=fileInput.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=(e)=>{
        fileUploadWrapper.querySelector("img").src=e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String=e.target.result.split(",")[1]

        // stores file data in userdata
        userData.file={
            data:base64String,
            mime_type:file.type
        }
        // clearing file input value to allow the user to select the same file again
        fileInput.value="";
    }
    reader.readAsDataURL(file);
})

// delete preview image
fileCancelButton.addEventListener("click",()=>{
    userData.file={};
    fileUploadWrapper.classList.remove("file-uploaded");
});

// ======Initialize emoji picker 
const picker = new EmojiMart.Picker({
theme:"light",
skinTonePosition:"none",
previewPosition:"none",
// click and select emoji
onEmojiSelect: (emoji)=>{
    const {selectionStart:start, selectionEnd:end}=messageInput;
    messageInput.setRangeText(emoji.native,start,end,"end");
    messageInput.focus();
},
onClickOutside:(e)=>{
    if(e.target.id==="emoji-picker"){
        document.body.classList.toggle("show-emoji-picker");
    }
    else{
         document.body.classList.remove("show-emoji-picker");
    }
}
});
document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click",(e)=>{
    handleOutgoingMessage(e)
    uniqUI.classList.add('hidden');
    // when msg send text area minimize
    textarea.style.height = "40px";
})
document.querySelector("#file-upload").addEventListener("click",()=>fileInput.click());


// dynamically hieght increase
const textarea = document.getElementById("message");
const minHeight = textarea.scrollHeight;

textarea.addEventListener("input", () => {
  textarea.style.height = "40px"; // reset to base
  textarea.style.height = textarea.scrollHeight + "px"; // content ke hisaab se set
});


// =====function start to here speech recognization======
 const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";       // Language
    recognition.interimResults = false; // Show only final results
    recognition.maxAlternatives = 1;  // One best result
    // On button click start recognition
    micButton.addEventListener("click", () => {
      recognition.start();
    micButton.classList.add("mic-active");
    });
    // When speech is recognized
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      messageInput.value=speechResult;
    };
    // On end (optional – auto restart nahi karega)
    recognition.onend = () => {
        micButton.classList.remove("mic-active");
      console.log("Speech recognition stopped.");
    };
     // Error handling
    recognition.onerror = (event) => {
      messageInput.value.textContent = "Error: " + event.error;
    }
    
    // =====Read Answer Today====
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("bot-speaker")) {
        const messageTextDiv = e.target.closest(".message-text");
        if (!messageTextDiv) return;

        let textToRead = messageTextDiv.cloneNode(true);
        const btn = textToRead.querySelector("button");
        if (btn) btn.remove();
        textToRead = textToRead.innerText.trim();
        if (!textToRead) return;

        // Toggle speaking
        if (e.target.classList.contains("speaking")) {
            // Stop speaking
            window.speechSynthesis.cancel();
            e.target.classList.remove("speaking");
        } else {
            // Detect language
            const lang = /[^\u0000-\u007F]/.test(textToRead) ? "hi-IN" : "en-IN";

            // Create utterance
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = lang;

            // Select Indian voice
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang === lang);
            if (voice) utterance.voice = voice;

            // Add speaking class
            e.target.classList.add("speaking");

            // Remove speaking class when done
            utterance.onend = () => {
                e.target.classList.remove("speaking");
            };

            // Speak
            window.speechSynthesis.speak(utterance);
        }
    }
});


// sidebaar action 
const sidebarClose=document.querySelector("#sidebaar_close");
const sidebarOpen=document.querySelector("#sidebaar_open");
const sideBaar=document.querySelector(".side-bar");
const newChat=document.querySelector('#new-chat');
const clearHistory=document.querySelector('#clear-history');
const chatDiv = document.querySelector("#chatHistory");
const robot=document.querySelector("#robot");

sidebarClose.addEventListener("click",()=>{
    sideBaar.style.right="-70%";
})
sidebarOpen.addEventListener("click",()=>{
    sideBaar.style.right="0%";
})
// clear history from histry box
clearHistory.addEventListener('click',()=>{
    localStorage.removeItem("userMessages");
   chatDiv.innerHTML="";
})

// new chat event
newChat.addEventListener('click',()=>window.location.reload());

 // =====Function: LocalStorage me save karo=====
 function saveUserMessage(message) {
  let messages = JSON.parse(localStorage.getItem("userMessages")) || [];
  messages.unshift(message);
  localStorage.setItem("userMessages", JSON.stringify(messages));

//   immideataly show in history
  let p = document.createElement("p");
  p.textContent = message;
  chatDiv.prepend(p); 
}

// run at page reloading time
window.onload=function(){
   let messages = JSON.parse(localStorage.getItem("userMessages")) || [];
    chatDiv.innerHTML="";
     messages.forEach(msg => {
      let p = document.createElement("p"); 
      p.textContent = msg;                 
      chatDiv.appendChild(p);             
    }); 
}

// *********  AI Assitent  **********
const robotrecognition = new webkitSpeechRecognition();
robotrecognition.lang = "en-IN"; 
robotrecognition.continuous = false;
// Function to speak answer
function speak(answer,lang="hi-IN") {
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = lang;
       robot.classList.add("speak");
    // Remove speak class when speech ends
    utterance.onend = () => {
        robot.classList.remove("speak");
    };
    speechSynthesis.speak(utterance);
}
// Function to call API and get response
async function getSortResponse(promptText) {
    const requestSort = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            contents: [{
                parts: [{ text:promptText }]
            }]
        })
    };
    try {
        const response = await fetch(API_URL, requestSort);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error?.message || "API Error");
        const apiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, no response";
        return apiResponseText;
    } catch(error) {
        console.log(error);
        return "Something went wrong!";
    }
}
robotrecognition.onstart = () => {
    robot.classList.add("listen"); // add listen class
};
robotrecognition.onend = () => {
    robot.classList.remove("listen");  // remove listen class
};
// Speech recognition result
robotrecognition.onresult = async (event) => {
    const userText = event.results[0][0].transcript.toLowerCase().trim();
     const lang = /[^\u0000-\u007F]/.test(userText) ? "hi-IN" : "en-IN";
     if(userText==="hello" || userText==="hii" || userText==="hey"){
        speak("hello dear, what can i help you?",lang);
        return;
    }
    else if(userText === "who are you" || userText==="hu r u"){
        speak("my name is NexaAssist and i am a virtual Assistant created by aman kumar gupta",lang);
        return;
    }
    else if(userText=="do you know about aman" || userText=="do you know about aman kumar" || userText=="do you know about aman kumar gupta"){
        speak("yes i know he is very soft heart person and developer who built me to assist you",lang);
        return;
    }
    else if(userText=="who is aman gupta" || userText=="who is aman kumar gupta" ||
         userText==="tell me about aman gupta" || userText==="tell me about aman kumar gupta"){
        speak("aman kumar gupta is an engineering student who is hails from azamgarh which is part of uttar pradesh and he is very soft and pure heart person",lang);
    }
    else if(userText.includes("time")){
       let time=new Date().toLocaleString(undefined,{hour:"numeric",minute:"numeric"})
       speak(time,lang)
    }
    // ====date
     else if(userText.includes("date")){
       let date=new Date().toLocaleString(undefined,{day:"numeric",month:"short",})
       speak(date,lang)
    }
    else{
        const promptText = /[^\u0000-\u007F]/.test(userText)
            ? "Please answer in Hindi, concisely in one line: " + userText
            : "Please answer in English (Indian accent), concisely in one line: " + userText;

        const answer = await getSortResponse(promptText);
        speak(answer,lang);
    }
     
    
};
// Start recognition on button click
robot.addEventListener("click", () => {
    robotrecognition.start();
});

window.addEventListener('load', () => {
    uniqUI.classList.remove('hidden');
    window.speechSynthesis.cancel();
});
//===== side baar hidden when focus on input
messageInput.addEventListener("focus",()=>{
    document.querySelector('.side-bar').style.right = "-70%";
})
// === get indivisually content  of chat history
chatDiv.addEventListener('click',(e)=>{
    e.preventDefault();
    if (e.target.tagName.toLowerCase() === "p") {
    const messageText = e.target.textContent;
    messageInput.value=messageText;
    document.querySelector('.side-bar').style.right = "-70%";
  }
})