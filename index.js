const wakaTimeStatsActivity = "https://wakatime.com/share/@demoutrei/c09a68c0-e3be-485b-9e8d-df674836d7ff.svg";
const wakaTimeStatsLanguages = "https://wakatime.com/share/@demoutrei/0376241d-6c52-4a1a-9bac-f46a370847f3.svg";
const mainBodyElement = document.querySelector("#mainBody");


const headerElement = document.createElement("header");

const profilePictureDiv = document.createElement("div");
profilePictureDiv.setAttribute("id", "profilePictureDiv");

const profilePictureElement = document.createElement("img");
profilePictureElement.setAttribute("id", "profilePicture");
profilePictureElement.src = "assets/demoutrei.png";
profilePictureDiv.appendChild(profilePictureElement);

headerElement.appendChild(profilePictureDiv);

const infoDiv = document.createElement("div");
infoDiv.setAttribute("id", "infoDiv");

const displayNameElement = document.createElement("h1");
displayNameElement.setAttribute("id", "displayName");
displayNameElement.textContent = "Demoutrei Kurosuke";
infoDiv.append(displayNameElement);

const usernameElement = document.createElement("div");
usernameElement.setAttribute("id", "username");
usernameElement.textContent = "demoutrei";
infoDiv.append(usernameElement);

headerElement.appendChild(infoDiv);


mainBodyElement.appendChild(headerElement);

const separator = document.createElement("hr");
separator.style.borderColor = "gray";
separator.style.marginBottom = "15px";
separator.style.marginTop = "15px";
separator.style.width = "98%";
mainBodyElement.appendChild(separator);

const mainContent = document.createElement("main");
mainContent.setAttribute("id", "mainContent");

const wakaTimeStatsSection = document.createElement("section");
wakaTimeStatsSection.id = "wakaTimeStats";

const wakaTimeStatsSectionTitle = document.createElement("div");
wakaTimeStatsSectionTitle.classList.add("section-title");
wakaTimeStatsSectionTitle.textContent = "WakaTime Stats";
wakaTimeStatsSection.appendChild(wakaTimeStatsSectionTitle);

const wakaTimeStatsActivityElement = document.createElement("img");
wakaTimeStatsActivityElement.setAttribute("id", "wakaTimeStatsActivity");
wakaTimeStatsActivityElement.src = wakaTimeStatsActivity;
wakaTimeStatsSection.appendChild(wakaTimeStatsActivityElement);

const wakaTimeStatsLanguagesElement = document.createElement("img");
wakaTimeStatsLanguagesElement.id = "wakaTimeStatsLanguages";
wakaTimeStatsLanguagesElement.src = wakaTimeStatsLanguages;
wakaTimeStatsSection.appendChild(wakaTimeStatsLanguagesElement);

mainContent.appendChild(wakaTimeStatsSection);

mainBodyElement.appendChild(mainContent);