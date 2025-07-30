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
