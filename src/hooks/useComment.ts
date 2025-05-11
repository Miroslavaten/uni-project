import {useCallback, useEffect, useState} from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  doc,
} from "firebase/firestore";
import {db} from "../firebase";
import {Comment} from "../types/CommentTypes.ts";

const commentConverter = {
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Comment {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      text: data.text,
      author: data.author,
      createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
      isReply: data.isReply,
      commentId: data.commentId?.id ?? null,
      children: [],
    };
  },
};

export const useComments = (taskId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const q = query(
        collection(db, "comments"),
        where("taskId", "==", doc(db, "tasks", taskId)),
        orderBy("createdAt", "asc"),
      );
      const snapshot = await getDocs(q);
      const loaded = snapshot.docs.map(commentConverter.fromFirestore);
      let computedComments = [];
      for (let comment of loaded) {
        if (comment.commentId) {
          for (let parent of computedComments) {
            if (parent.id === comment.commentId) {
              parent.children.push(comment);
            }
          }
        } else {
          computedComments.push(comment);
        }
      }
      setComments(computedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  }, [taskId])

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {comments, loading, refetch: fetchComments};
};
