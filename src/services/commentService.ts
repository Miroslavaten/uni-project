import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";
import { db } from "../firebase";

const commentsCollection = collection(db, "comments");

export const createComment = async (
  text: string,
  author: string,
  taskRef: DocumentReference,
  isReply: boolean = false,
  parentCommentRef?: DocumentReference,
) => {
  const newComment = {
    text,
    author,
    taskId: taskRef,
    isReply,
    commentId: parentCommentRef ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(commentsCollection, newComment);
  return docRef.id;
};

export const updateComment = async (commentId: string, newText: string) => {
  const commentRef = doc(db, "comments", commentId);
  await updateDoc(commentRef, {
    text: newText,
    updatedAt: serverTimestamp(),
  });
};

export const deleteComment = async (commentId: string) => {
  const commentRef = doc(db, "comments", commentId);
  await deleteDoc(commentRef);
};
