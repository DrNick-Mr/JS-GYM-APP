# HIIT 

## Technologies Used

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
* **Backend (implied/API interaction):** Node.js/Express (assuming this based on API structure), MongoDB (or other database used)
* **Tools:** Git, GitHub

## How to Run Locally

1.  **Clone the repository:**
    `git clone [your-repo-link]`
    `cd HIIT-up2112651`
2.  **Install dependencies (if you have a `package.json` for a Node.js backend or dev tools):**
    `npm install` (or `yarn install`)
3.  **Start the server (if applicable):**
    `npm start` (or `node server.js` or whatever command starts your backend)
4.  **Open in browser:** Navigate to `http://localhost:[your-port]` (e.g., `http://localhost:3000`).


### Key features

### Back/Refresh button in browser/Description.
The single page application works by storing the state of the page every time one of the nav buttons is clicked. The function for this is storeState within the index.js file. It basically uses the history function and pushState function to keep a record of the last page visit. 


### URL
As it is a single web application when the apps is loaded it goes directly to the home view if not URL is specified, this helps to have organised views as barely no code exists within the index.html file, therefore, if browser automatically loads index.html by default the page would be empty/blank which is something that might lead the user to think that the app is not loading. Consequently, I decided to create a function called readPath to read the url and if not path is specified it would return home view and load the app.

### title page
The title of the page changes according to the view the user is at. so every time the user navigates through the app, the title of page changes. This gives the user the experience of multiple pages when it actually is a working single page app.

### Creation of workout
The user is able to create a workout from scratch from the createworkout view as no workouts exist in the database the user will have to create its first workout when the page is loaded before interacting with the timer. The user is able to assign a name to the workout and select from different exercises within the select menu. However, the user needs to manually add breaks to the workout according to their needs.

### adding custom exercise
If the user finds itself in the situation of not finding the exercise required for their workout, the user is able to add a custom exercise within the add a custom exercise! menu within the createworkout view, this menu is displayed by clicking the button 'add a custom exercise!' it should be hidden by default and the user is able to hide it again after it finishes adding new exercises, the user is required to add a name, a description and a time to the exercise. Once is added, it will be displayed in the workout and added to the database for record keeping and future use. Therefore, the user will not lose any of the created exercises.

### workouts record keeping
Once the workout is created in the createworkout view and the user clicks create workout, the workout will be displayed in the workout view and send to the database for record keeping and future use. Therefore, the user will not have to create the same workout every time it needs it. The workout will be available for future use after it is created.

### Show and hide exercises of workouts
in order to have a cleaner view within the workouts view I decided to create a button for each workout called 'show exercises' this button displays the exercises of the corresponding workout and the same button hides the exercises as per user need. This helps to have a cleaner page and decreased the length of the page so the user does not have to scroll down a lot to find a workout after creating plenty workouts.

### no use of users
as a cyber security student, I do not think is practical to log in as a user just by clicking a button with a name. if no password or security is present I prefer not to implement users in my app. This could probably cause me to lose marks as any user sharing the app could fill the create workout page and the workouts page of spam but in my opinion, this is not solved if the users are able to log in as someone else just by clicking a button. 

### audio cues.
audio added to the timer for audio cues.


## AI
REMOVE ME: Detail your use of AI, listing of the prompts you used, and whether the results formed or inspired part of your final submission and where we can see this (and if not, why not?). You may wish to group prompts into headings/sections - use markdown in any way that it helps you communicate your use of AI. 

### Prompts to develop Timer (exmaple)
A sequence of prompts helped me develop this feature:

> How can I calculate the time for an exercise if the time is given as an integer representing minutes? 
The response was useful as it help understan the use of / and % I then use parseInte(timer / 60,10) to calculate minutes and the same formula but with % to calculate the seconds, so: I implemented this in the startTimer function 

>  I gave the function stopTimer and startTimer to AI and asked how can I use these two functions to start interacting with the timer?
The response was kind of useless because the function given by AI was adding an event listener multiple times. However, I used this as a based to start writing my toggleTimer function. As I noticed the event listener was being added multiple times and this caused a weird behaviour in the time, for example, the timer would work perfectly when calling a first workout but once stopping it and starting a second workout the timer would not start at all. 

After noticing this I decided to split the function into to one that fetches the workout data called sendWorkoutToTimer within the workouts.js file and another called addEventListener to timer. I then use a global variable to pass the exercises to the toggleTimer function as this function is the one that starts and pauses the timer. 

### Prompts to debug server.js file (fix endpoints)
For the server to fetch and post data, it was necessary to implement endpoints like get and post from the server.js file. The problem I was having is that after correctly exporting function from the database.js file and creating function to get the response or request parameters within the database, I would still get 404 errors and this caused the app to crash. 

>  I copied the whole code from server.js file and asked the AI what is wrong with my functions as they are causing 404 errors?
The response was that I was missing small details like /'s when creating and endpoint so for example instead of having hiitApp.get('/exercises', getExercises) I had hiitApp.get('exercises', getExercises) and for some reason this was causing the app to crash after trying to get the exercises. very dumb mistake :). I also was missing :'s when creating endpoints, for example, I had hiitApp.get('/exercises/id', getExercise); instead of hiitApp.get('/exercises/:id', getExercise);

This was really helpful as I spent hours checking every function within the database.js file and the server.js file but the problem was coming from somewhere else. I think I copied the whole code from server.js out of frustation but it turned out for the good. 

###Prompts to develop Audio cues
> how to add audios to a web application using node.js and HTML5?
It basically explain me to use the <audio> that within the HTML5 and the get the element using getElementByID, I changed this to be querySelector and then I just haave to place the audios within the javascript functions when I want the audio to start and to stop. 
