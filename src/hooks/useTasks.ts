// hooks/useTasks.ts
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import {Task} from "../types/TaskTypes.ts";
import { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";



const taskConverter = {
  toFirestore(task: Task): DocumentData {
    return task;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Task {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description,
      columnId: data.columnId,
      author: data.author,
      order: data.order,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
    };
  },
};

export const useTasks = (columnId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, "tasks");
        const q = query(
          tasksRef,
          where("columnId", "==", doc(db, 'columns', columnId)),
          orderBy("order", "asc")
        );
        const querySnapshot = await getDocs(q);

        const loadedTasks: Task[] = querySnapshot.docs.map((doc) => taskConverter.fromFirestore(doc));
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [columnId]);

  return { tasks, loading };
};
