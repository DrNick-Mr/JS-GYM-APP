import { hideElement, showElement } from './index.js';
import { displayWorkoutsNames, fetchWorkoutDetails, fetchWorkouts, sendWorkoutToDb } from './workouts.js';

let creatingWorkout = false; // this variable is used to keep track if a workout is being created.

export async function showExercises() {
    const exercisesFetch = await fetch('/exercises')
    const exercises = await exercisesFetch.json();
    const exercisesDisplay = document.querySelector('#select-exercise');
    for (const exercise of exercises) {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = exercise.title;
        option.setAttribute('exercise-description', exercise.msg);
        option.setAttribute('exercise-time', exercise.timeEx);
        exercisesDisplay.appendChild(option);
    }
}

export function addEventsCW() {
    const buttonAddTitle = document.querySelector('#addTitle');
    buttonAddTitle.addEventListener('click', createWorkoutTitle);

    const buttonAddExercise = document.querySelector('#addExercise');
    buttonAddExercise.addEventListener('click', addExerciseToWorkout);

    const buttonCreateExercise = document.querySelector('#createExercise');
    buttonCreateExercise.addEventListener('click', addCustomExercise);

    hideCustomExerciseBox();

    const showCustomBoxButton = document.querySelector('#showCustomBox');
    showCustomBoxButton.addEventListener('click', showCustomExerciseBox);

    const hideCustomBoxButton = document.querySelector('#hideCustomBox');
    hideCustomBoxButton.addEventListener('click', hideCustomExerciseBox);
}

async function createWorkoutTitle() {
    if (!creatingWorkout) {
        const article = document.querySelector('section.screen[data-id="template-createworkout"]');
        const workoutTitle = article.querySelector('#workoutTitle');
        const newWorkoutTitle = workoutTitle.value.trim()

        if (workoutTitle.value != '') {
            const existingWorkouts = await fetchWorkouts();
            const existingWorkoutNames = new Set(existingWorkouts.map(workout => workout.workoutName.toLowerCase()));
            if(existingWorkoutNames.has(newWorkoutTitle.toLowerCase())){
                alert(`A workout with the name "${newWorkoutTitle}" already exists`)
                return
            }s

            creatingWorkout = true;
            const div = document.createElement('div');
            div.setAttribute('class', 'workoutCreation');
            const text = document.querySelector('#workoutTitle').value;
            const h2 = document.createElement('h2');
            h2.setAttribute('id', 'workoutname');
            h2.textContent = text;
            const button = document.createElement('button');
            button.textContent = 'create workout';
            button.setAttribute('id', 'fetchWorkout');
            button.addEventListener('click', createWorkoutElement);
            article.appendChild(div);
            div.append(h2);
            div.appendChild(button);

        } else {
            alert('not empty value allowed');
        }
    } else {
        alert('You can create only one workout at the time.')
    }
}


export function addExerciseToWorkout() {
    const div = document.querySelector('section.screen[data-id="template-createworkout"] .workoutCreation');
    if (div) {
        const select = document.querySelector('#select-exercise');
        const selectedExercise = select.options[select.selectedIndex];
        if (selectedExercise.value === ""){
            alert("Please, select or add a valid exercise")
            return
        }
        const title = selectedExercise.textContent;
        const description = selectedExercise.getAttribute('exercise-description');
        const time = selectedExercise.getAttribute('exercise-time');
        const p = document.createElement('p');
        p.setAttribute('exercise-id', selectedExercise.value);
        p.setAttribute('exercise-name', title);
        p.setAttribute('exercise-time', time);
        p.textContent = `${title}: ${description}, Time: ${time} minutes`;
        div.appendChild(p);
    } else {
        alert('A title is necessary before adding any exercise');
    }
}

function hideCustomExerciseBox() {
    const customExerciseBox = document.querySelector('.createExercise');
    hideElement(customExerciseBox);
}

function showCustomExerciseBox() {
    const customExerciseBox = document.querySelector('.createExercise');
    showElement(customExerciseBox);
}

async function addCustomExercise() {
    const div = document.querySelector('.workoutCreation');
    const select = document.querySelector('#select-exercise');
    const options = document.querySelectorAll('option');
    let exerciseExist = false;
    if (div && select) {
        const exerciseName = document.querySelector('#exerciseName').value;
        const exerciseDescription = document.querySelector('#exerciseDescription').value;
        const exerciseTime = document.querySelector('#exerciseTime').value;
        console.log(exerciseDescription);
        for (const option of options) {
            if (exerciseName === option.textContent) {
                exerciseExist = true;
                break
            }
        }

        if (exerciseExist) {
            alert('exercise already exists in the list, please add it from the list');
        } else {
            console.log('exercise does not exist');
            const newExercise = await sendExerciseToDb(exerciseName, exerciseDescription, exerciseTime);
            const p = document.createElement('p');
            p.textContent = `${exerciseName}: ${exerciseDescription} time: ${exerciseTime}`;
            p.setAttribute('exercise-id', newExercise.id);
            p.setAttribute('exercise-name', newExercise.title);
            p.setAttribute('exercise-description', newExercise.msg);
            p.setAttribute('exercise-time', newExercise.timeEx);
            div.appendChild(p);
        }
    } else {
        alert('Add a title to the workout');
    }
}

function removeContentFromExercisesList() {
    const list = document.querySelector('#select-exercise');
    const options = document.querySelectorAll('option');
    for (const option of options) {
        if (option.value !== '') {
            list.removeChild(option);
        }
    }
}

export async function sendExerciseToDb(exerciseName, exerciseDescription, exerciseTime) {
    const payload = {
        title: exerciseName,
        msg: exerciseDescription,
        time: exerciseTime
    };
    const response = await fetch('/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const newExercise = await response.json();
        removeContentFromExercisesList();
        showExercises();
        return newExercise;
    } else {
        console.log('failed to send: ', response.statusText);
    }
}

async function createWorkoutElement() {
    const workoutDetails = fetchWorkoutDetails();
    await sendWorkoutToDb(workoutDetails.workoutName, workoutDetails.workoutExercises);
    displayWorkoutsNames();
    cleanCreateView();
    creatingWorkout = false;
}

function cleanCreateView() {
    const div = document.querySelector('.workoutCreation');
    div.remove();
}