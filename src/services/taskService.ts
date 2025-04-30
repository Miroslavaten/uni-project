import { db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  DocumentReference
} from "firebase/firestore";
import {Task} from "../types/TaskTypes.ts";

const tasksCollection = collection(db, "tasks");

export const createTask = async (author: string, title: string, description: string, columnRef: DocumentReference, order: number = 0) => {
  const newTask = {
    author,
    title,
    description,
    legend: '',
    columnId: columnRef,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const taskDoc = await addDoc(tasksCollection, newTask);
  return taskDoc.id;
};

export const updateTask = async (taskId: string, updates: Partial<Omit<Task, "id">>) => {
  const taskDocRef = doc(db, "tasks", taskId);

  await updateDoc(taskDocRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId: string) => {
  const taskDocRef = doc(db, "tasks", taskId);

  await deleteDoc(taskDocRef);
};
