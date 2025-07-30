import * as cw from './createworkout.js';
import { addListenersToTimer, displayWorkoutsNames } from './workouts.js';

const screens = [
    {
        screen: 'home',
        title: 'home'
    },
    {
        screen: 'createworkout',
        title: 'create a workout!'
    },
    {
        screen: 'workoutScreen',
        title: 'workouts'
    },
];

// reference to the main UI elements
const ui = {};
const templates = {};

function getHandles() {
    ui.mainNav = document.querySelector('header > nav');
    ui.main = document.querySelector('main');
    ui.workoutTitle = document.querySelector('#workoutTitle');
    ui.selectExercise = document.querySelector('#select-exercise');
    ui.exerciseName = document.querySelector('#exerciseName');
    ui.exerciseDescription = document.querySelector('#exerciseDescription');
    ui.addExerciseButton = document.querySelector('#createExercise')
    ui.getNavButtons = () => Object.values(ui.buttons);
    ui.views = {};
    ui.getViews = () => Object.values(ui.views);

    templates.createWorkout = document.querySelector('#clientView');
}

function setUpNav() {
    ui.buttons = {};
    for (const screen of screens) {
        const button = document.createElement('button');
        button.textContent = screen.title;
        button.dataset.screen = screen.screen;
        button.addEventListener('click', show)
        button.addEventListener('click', storeState)
        ui.mainNav.append(button);

    }
}

function buildScreens() {
    const template = templates.createWorkout;
    for (const screen of screens) {
        const view = template.content.cloneNode(true).firstElementChild;
        view.dataset.id = `template-${screen.screen}`;
        view.dataset.name = screen.title;
        ui.main.append(view)
        ui.views[screen.screen] = view;
    }
}

async function fetchViewContent(view) {
    const url = `/screens/${view}.html`;
    const response = await fetch(url);
    if (response.ok) {
        return await response.text();
    } else {
        return `sorry a ${response.status} error ocurred 'page does not exist'`
    }
}

async function getView() {
    for (let screen of screens) {
        const content = await fetchViewContent(screen.screen);
        const article = document.createElement('article');
        article.innerHTML = content;
        ui.views[screen.screen].append(article)
    }
}

function show(event) {
    ui.previous = ui.current;
    const screen = event?.target?.dataset?.screen ?? 'home';
    showScreen(screen);
}

function showScreen(name) {
    hideAllViews();
    showElement(ui.views[name]);
    ui.current = name;
    document.title = `HiitApp | ${name}`;
}

export function showElement(e) {
    e.classList.remove('hidden');
}

export function hideElement(e) {
    e.classList.add('hidden')
}

function hideAllViews() {
    for (const view of ui.getViews()) {
        hideElement(view);
    }
}

function storeState() {
    history.pushState(ui.current, ui.current, `/app/${ui.current}`);
    console.log(ui.current);
}

function readPath() {
    const path = window.location.pathname.slice(5);
    if (path) {
        console.log(path);
        return path
    } else {
        console.log(path);
        return 'home'
    }
}

function loadInitialScreen() {
    ui.current = readPath();
    showScreen(ui.current);
}

async function loadPage() {
    getHandles();
    buildScreens();
    setUpNav();
    await getView();
    cw.showExercises();
    cw.addEventsCW();
    await displayWorkoutsNames();
    addListenersToTimer();
    window.addEventListener('popstate', loadInitialScreen);
    loadInitialScreen();
}

loadPage();