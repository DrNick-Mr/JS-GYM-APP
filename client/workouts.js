export function removeElement() {
    const workoutContainer = document.querySelector("#workouts-container");
    const workouts = workoutContainer.querySelectorAll(".workout");
    if (workouts.length > 0) {
        const element = document.querySelector("#noworkout");
        if (element) {
            element.remove();
        }
    }
}

export function fetchWorkoutDetails() {
    // Select the workout name element
    const template = document.querySelector(
        'section.screen[data-id="template-createworkout"]'
    );
    const workoutNameElement = template.querySelector("#workoutname");
    const workoutName = workoutNameElement ? workoutNameElement.textContent : "";

    // Select the workout exercises elements
    const workoutExercises = [];
    const exercises = template.querySelectorAll(
        ".workoutCreation p[exercise-name][exercise-time]"
    );
    console.log(exercises);
    for (const exercise of exercises) {
        workoutExercises.push({
            id: exercise.getAttribute("exercise-id"),
            name: exercise.getAttribute("exercise-name"),
            time: exercise.getAttribute("exercise-time"),
        });
    }
    return {
        workoutName: workoutName,
        workoutExercises: workoutExercises,
    };
}

export function createWorkout(workoutName, workoutExercises) {
    const article = document.querySelector(
        'section.screen[data-id="template-workoutScreen"] article'
    );
    const workoutContainer = article.querySelector("#workouts-container");
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = "start";
    button.setAttribute("id", "sendToTimer");
    div.setAttribute("class", "workout");
    const workoutname = document.createElement("h3");
    workoutname.setAttribute("id", "workoutname");
    workoutname.textContent = workoutName;
    article.append(div);
    div.appendChild(workoutname);
    div.appendChild(button);
    const exerciseList = document.createElement("ul");
    workoutExercises.forEach((exercise) => {
        const listExercise = document.createElement("li");
        listExercise.textContent = `${exercise.name}: time: ${exercise.time} minutes`;
        exerciseList.appendChild(listExercise);
    });
    div.appendChild(exerciseList);
    workoutContainer.appendChild(div);
    return div;
}

export async function fetchWorkouts() {
    try {
        const response = await fetch("/workouts");
        if (!response.ok) {
            throw new Error("Failed to fetch workouts");
        }
        const workouts = await response.json();
        return workouts;
    } catch (error) {
        console.error("Error fetching workouts: ", error);
        return [];
    }
}

export async function displayWorkoutsNames() {
    const workouts = await fetchWorkouts();
    const workoutIds = [];
    const template = document.querySelector(
        'section.screen[data-id="template-workoutScreen"] article'
    );
    const container = template.querySelector("#workouts-container");
    container.innerHTML = "";
    workouts.forEach((workout) => {
        //creates a div for the workout
        const workoutDiv = document.createElement("div");
        workoutDiv.setAttribute("class", "workout");
        workoutDiv.setAttribute("data-workout-id", workout.id);
        //creates the workout title
        const h3 = document.createElement("h3");
        h3.setAttribute("data-workout-name", workout.workoutName);
        workoutIds.push(workout.id);
        h3.textContent = workout.workoutName;

        //creates the start button for each workout.
        //this button is used to fetch the workout data for the timer.
        const startButton = document.createElement("button");
        startButton.textContent = "start";
        startButton.setAttribute("id", "sendToTimer");

        //creates display button for the exercises of each workout
        const displayButton = document.createElement("button");
        displayButton.textContent = "Show Exercises";
        displayButton.setAttribute("id", "showExercises");

        //creates delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("id", "deleteWorkout");

        workoutDiv.appendChild(h3);
        workoutDiv.appendChild(startButton);
        workoutDiv.appendChild(displayButton);
        workoutDiv.appendChild(deleteButton);
        container.appendChild(workoutDiv);
    });
    const showExercisesButtons = template.querySelectorAll("#showExercises");
    showExercisesButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const workoutId = button.parentElement.getAttribute("data-workout-id");
            const displaying = button.textContent === "Hide Exercises";
            if (displaying) {
                hideExercisesOfWorkout(workoutId);
                button.textContent = "Show Exercises";
            } else {
                await displayExercisesOfWorkout(workoutId);
                button.textContent = "Hide Exercises";
            }
        });
    });

    addEventDeleteWorkout();
    removeElement();
    await startInteractionWithTimer();
}
function hideExercisesOfWorkout(workoutId) {
    const container = document.querySelector("#workouts-container");
    const workoutDiv = container.querySelector(
        `[data-workout-id="${workoutId}"]`
    );
    if (!workoutDiv) {
        console.error(`Workout div not found for workout ID: ${workoutId}`);
        return;
    }

    // Remove any existing exercise lists
    const exerciseLists = workoutDiv.querySelectorAll("ul");
    exerciseLists.forEach((list) => list.remove());
}

async function displayExercisesOfWorkout(workoutId) {
    const container = document.querySelector("#workouts-container");
    const workoutDiv = container.querySelector(
        `[data-workout-id="${workoutId}"]`
    );
    if (!workoutDiv) {
        console.error(`Workout div not found for workout ID: ${workoutId}`);
        return;
    }

    const exercises = await fetchExercisesOfWorkouts(workoutId);
    const exerciseList = document.createElement("ul");
    for (const exercise of exercises) {
        const exerciseDetails = await fetchExerciseDetails(exercise.exerciseId);
        const listItem = document.createElement("li");
        listItem.setAttribute("data-exercise-id", exercise.exerciseId);
        listItem.textContent = `${exerciseDetails.title}: ${exerciseDetails.msg} time: ${exerciseDetails.timeEx}`;
        exerciseList.appendChild(listItem);
    }
    workoutDiv.appendChild(exerciseList);
}

async function fetchExerciseDetails(exerciseId) {
    const response = await fetch(`/exercises/${exerciseId}`);
    if (response.ok) {
        const exercise = await response.json();
        return exercise;
    } else {
        console.log("failed to fetch exercise details");
    }
}

async function fetchExercisesOfWorkouts(workoutId) {
    const response = await fetch(`/workouts/${workoutId}/exercises`);
    if (response.ok) {
        const exercises = await response.json();
        return exercises;
    } else {
        console.log("not exercises of workouts obtained");
    }
}

export async function sendWorkoutToDb(workoutName, workoutExercises) {
    const response = await fetch("/workouts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            workoutName: workoutName,
            workoutExercises: workoutExercises,
        }),
    });
    if (response.ok) {
        console.log("Workout details sent to the database successfully");
    } else {
        console.log("Failed to send workout");
    }
}

async function addEventDeleteWorkout() {
    const deleteButtons = document.querySelectorAll("#deleteWorkout");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => deleteWorkout(button));
    });
}

async function deleteWorkout(button) {
    const workoutId = button.closest(".workout").dataset.workoutId;
    const response = await fetch(`/workouts/${workoutId}`, {
        method: "DELETE",
    });
    if (response.ok) {
        button.closest(".workout").remove();
        console.log("workout deleted");
    } else {
        console.log("failed to delete workout");
    }
}

let interval;
let isTimerRunning = false;
let remainingTime = 0;
let exercises = [];
let currentExerciseIndex = 0;

async function startInteractionWithTimer() {
    const template = document.querySelector(
        'section.screen[data-id="template-workoutScreen"] article'
    );
    const workoutsContainer = template.querySelector("#workouts-container");
    const buttons = workoutsContainer.querySelectorAll("#sendToTimer");
    buttons.forEach((button) => {
        button.addEventListener("click", () => sendWorkoutToTimer(button));
    });
}

async function sendWorkoutToTimer(button) {
    stopTimer();
    const workoutId = button.closest(".workout").dataset.workoutId;

    // Fetch workout details
    const workoutResponse = await fetch(`/workouts/${workoutId}`);
    const workoutData = await workoutResponse.json();
    const workoutName = workoutData[0].workoutName;
    exercises = [];

    // Fetch exercises for the workout
    const exercisesIds = await fetchExercisesOfWorkouts(workoutId);
    for (const id of exercisesIds) {
        const exercise = await fetchExerciseDetails(id.exerciseId);
        exercises.push(exercise);
    }

    currentExerciseIndex = 0;

    // Update timer display
    const timerContainer = document.querySelector(".timer");
    timerContainer.querySelector("h2").textContent = workoutName;
    timerContainer.querySelector("h3").textContent = exercises[0].title;
    timerContainer.querySelector("p").textContent = formatTime(
        exercises[0].timeEx,
        "00"
    );

    resetTimerState();
    return exercises;
}

export async function addListenersToTimer() {
    const timer = document.querySelector(".timer");
    const startButton = timer.querySelector("#start");
    startButton.addEventListener("click", () => toggleTimer(exercises));

    const stopButton = timer.querySelector("#stop");
    stopButton.addEventListener("click", stopTimer);
}

function resetTimerState() {
    clearInterval(interval); // Clear any existing interval
    isTimerRunning = false;
    remainingTime = 0;
}

function toggleTimer(exercises) {
    const timerContainer = document.querySelector(".timer");
    const button = timerContainer.querySelector("#start");
    const buttonText = button.textContent;

    if (buttonText === "start" || buttonText === "resume") {
        startTimer(exercises, remainingTime);
        button.textContent = "pause";
        isTimerRunning = true;
        playAudioCue("workingOut");
    } else if (buttonText === "pause") {
        pauseTimer();
        button.textContent = "resume";
        isTimerRunning = false;
    }
}

function startTimer(exercisesArg, remainingTime = 0) {
    const timerContainer = document.querySelector(".timer");
    const pause = timerContainer.querySelector("#start");
    pause.textContent = "pause";

    const currentExerciseDetails = exercisesArg[0];
    let timerValue;
    if (remainingTime === 0) {
        if (!currentExerciseDetails) { // `exercisesArg.length === 0` is covered by `!currentExerciseDetails` if it's based on index 0.
            console.warn("No valid exercise provided to startTimer(). Stopping timer.");
            stopTimer(); // Ensure timer stops if no exercises are found
            return;
        }
        timerValue = currentExerciseDetails.timeEx * 60;
    } else {
        timerValue = remainingTime
    }

    const currentExerciseTitle = currentExerciseDetails.title;
    timerContainer.querySelector('h3').textContent = currentExerciseTitle;

    interval = setInterval(() => {
        timerValue--;
        if(timerValue <= 0){
            clearInterval(interval)
            document.querySelector('.timer p').textContent = formatTime('00', '00')
            currentExerciseIndex++
    
            if(currentExerciseIndex < exercises.length){
                const nextExercise = exercises[currentExerciseIndex];
                timerContainer.querySelector('h3').textContent = nextExercise.title;
                startTimer(exercises.slice(currentExerciseIndex),0);
            } else {
                setTimeout(() =>{
                    stopTimer();
                    alert("all exercises finished")
            }, 150)
            }
        } else {
            let minutes = parseInt(timerValue / 60,10);
            let seconds = parseInt(timerValue % 60,10);

            minutes = minutes < 10 ? "0" + minutes :minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            document.querySelector(".timer p").textContent = formatTime(
                minutes,
                seconds
            );
        }
    },1000  )
}

function formatTime(minutes, seconds) {
    return minutes + ":" + seconds;
}

function pauseTimer() {
    clearInterval(interval);
    remainingTime = calculateRemainingTime(); // Calculate remaining time
    playAudioCue("workingOut", "True");
}

function calculateRemainingTime() {
    const timerDisplay = document.querySelector(".timer p").textContent;
    const [minutes, seconds] = timerDisplay
        .split(":")
        .map((num) => parseInt(num, 10));
    return minutes * 60 + seconds;
}

function stopTimer() {
    clearInterval(interval);
    const timerContainer = document.querySelector(".timer");
    const pauseButton = timerContainer.querySelector("#start");
    pauseButton.textContent = "start";
    timerContainer.querySelector("h2").textContent = "Workout";
    timerContainer.querySelector("h3").textContent = "exercise"; // Clear exercise title
    document.querySelector(".timer p").textContent = "00:00";
    exercises = [];
    remainingTime = 0;
    playAudioCue("workingOut", "True");
}

function playAudioCue(type, stop = false) {
    const audioGo = document.querySelector("#go");
    const audioStop = document.querySelector("#stop");
    const audioWorkingOut = document.querySelector("#workingOut");

    switch (type) {
        case "start":
            audioStop.pause(); // Pause the stop audio if it's playing
            audioGo.play();
            break;
        case "stop":
            audioGo.pause(); // Pause the go audio if it's playing
            audioWorkingOut.pause(); // Pause the workingOut audio if it's playing
            audioStop.play();
            break;
        case "workingOut":
            audioStop.pause(); // Pause the stop audio if it's playing
            audioWorkingOut.play();
            break;
    }

    if (stop) {
        audioGo.pause();
        audioStop.pause();
        audioWorkingOut.pause();
    }
}
