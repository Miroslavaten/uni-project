export interface KanbanColumnProps {
    columnId: string;
    title: string;
}
export interface KanbanColumnPropsWithRegister extends KanbanColumnProps {
    registerRefetch: (refetch: () => void) => void;
}