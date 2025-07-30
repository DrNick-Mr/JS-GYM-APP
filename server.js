import express from 'express';
import * as db from './database.js';
import * as url from 'url';

const port = 8080;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const hiitApp = express();

async function getExercises(req, res) {
    res.json(await db.tableExercises());
}

async function getExercise(req, res) {
    const exercise = await db.findExercise(req.params.id);
    res.json(exercise);
}

async function postExercise(req, res) {
    const exercise = await db.addExercise(req.body.title, req.body.msg, req.body.time)
    res.json(exercise);
}

async function postWorkout(req, res) {
    try {
        const { workoutName, workoutExercises } = req.body;
        const workoutId = await db.addWorkout(workoutName);
        for (const exercise of workoutExercises) {
            await db.addExercisesOfWorkout(workoutId, exercise.id);
        }
        res.json({ success: true, workoutId });
    } catch (error) {
        console.log('Error creating workout: ', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getWorkouts(req, res) {
    const workouts = await db.getWorkoutsTable();
    res.json(workouts);
}

async function getWorkoutById(req, res) {
    const workoutId = req.params.workoutId;
    const workout = await db.workoutById(workoutId);
    res.json(workout);
}

async function getWorkoutExercises(req, res) {
    const workoutId = req.params.workoutId;
    const workoutExercises = await db.getExercisesOfWorkoutById(workoutId);
    res.json(workoutExercises);
}

async function deleteWorkoutFromTable(req, res) {
    const workoutId = req.params.workoutId;
    const deleted = await db.deleteWorkout(workoutId);
    if (deleted) {
        res.json(deleted);
    } else {
        console.log('error deleting the workout')
    }
}

hiitApp.get('/exercises', getExercises);
hiitApp.get('/exercises/:id', getExercise);
hiitApp.get('/workouts', getWorkouts);
hiitApp.get('/workouts/:workoutId', getWorkoutById);
hiitApp.post('/exercises', express.json(), postExercise);
hiitApp.post('/workouts', express.json(), postWorkout);
hiitApp.get('/workouts/:workoutId/exercises', getWorkoutExercises);
hiitApp.delete('/workouts/:workoutId', deleteWorkoutFromTable);

hiitApp.use(express.static('client'));

hiitApp.get('/app/*/', (req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});

hiitApp.listen(port);
console.log(`listening on ${port}`);