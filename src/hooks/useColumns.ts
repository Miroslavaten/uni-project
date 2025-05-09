// hooks/useColumns.ts
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { Column } from "../types/ColumnsTypes.ts";

const columnConverter = {
  toFirestore(column: Column): DocumentData {
    return column;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Column {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      title: data.title,
      order: data.order,
    };
  },
};

export const useColumns = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const columnsRef = collection(db, "columns");
        const q = query(columnsRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const cols: Column[] = querySnapshot.docs.map((doc) =>
          columnConverter.fromFirestore(doc),
        );
        setColumns(cols);
      } catch (error) {
        console.error("Error fetching columns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColumns();
  }, []);

  return { columns, loading };
};
