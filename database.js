import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';


const dbConn = init();

async function init() {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database,
        verbose: true,
    });
    await db.migrate({ migrationsPath: './migrations-sqlite' });
    return db;
}

export async function tableExercises() {
    const db = await dbConn;
    const exercises = await db.all('SELECT * FROM Exercise ORDER BY id DESC LIMIT 10')
    return exercises;
}

export async function findExercise(id) {
    const db = await dbConn;
    const exercise = db.get('SELECT * FROM Exercise WHERE id = ?', id);
    return exercise;
}

export async function addExercise(title, msg, time) {
    const db = await dbConn;
    // Check if the exercise title already exists
    const existingExercise = await db.get('SELECT * FROM Exercise WHERE title = ?', [title]);
    if (existingExercise) {
        console.log('This exercise already exists, find it on the list');
    } else {
        const newId = uuid();
        await db.run('INSERT INTO Exercise VALUES (?, ?, ?, ?)', [newId, title, msg, time]);
        const newExercise = await db.get('SELECT * FROM Exercise WHERE id = ?', [newId]);
        return newExercise;
    }
}

export async function addWorkout(workoutName) {
    const db = await dbConn;
    const workoutId = uuid();
    await db.run('INSERT INTO Workouts (id, workoutName) VALUES (?,?)', [workoutId, workoutName]);
    return workoutId;
}

export async function addExercisesOfWorkout(workoutId, exerciseId) {
    const db = await dbConn;
    await db.run('INSERT INTO WorkoutExercises (workoutId, exerciseId) VALUES (?,?)', [workoutId, exerciseId]);
}

export async function getWorkoutsTable() {
    const db = await dbConn;
    const workouts = await db.all('SELECT * FROM Workouts ORDER BY id DESC LIMIT 10');
    return workouts;
}

export async function workoutById(id) {
    const db = await dbConn;
    const workout = await db.all('SELECT * FROM Workouts WHERE id = ?', id);
    return workout;
}

export async function getWorkoutExercisesTable() {
    const db = await dbConn;
    const workoutExercises = await db.all('SELECT * FROM WorkoutExercises ORDER BY workoutId DESC LIMIT 10');
    return workoutExercises;
}

export async function getExercisesOfWorkoutById(id) {
    const db = await dbConn;
    const exercises = await db.all('SELECT * FROM WorkoutExercises WHERE workoutId = ?', id);
    return exercises;
}

export async function deleteWorkout(id) {
    const db = await dbConn;
    const workoutDeleted = await db.all('DELETE FROM Workouts WHERE id = ?', id);
    return workoutDeleted;
}