"use client";

import type { Todo } from "@/app/page";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  Calendar,
  MapPin,
  Package,
  FileText,
  Edit,
  Check,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { ImageDialog } from "./ImageDialog";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onBulkComplete: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
  showCompleted?: boolean;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onBulkComplete,
  onBulkDelete,
  showCompleted = false,
}: TodoListProps) {
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleBulkSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTodos);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTodos(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTodos(new Set(todos.map((todo) => todo.id)));
    } else {
      setSelectedTodos(new Set());
    }
  };

  const handleBulkComplete = () => {
    onBulkComplete(Array.from(selectedTodos));
    setSelectedTodos(new Set());
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedTodos));
    setSelectedTodos(new Set());
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <CardTitle className="text-xl text-gray-600 mb-2">
            {showCompleted ? "No completed tasks yet" : "No pending tasks"}
          </CardTitle>
          <CardDescription>
            {showCompleted
              ? "Complete some tasks to see them here"
              : "Create your first inventory task to get started"}
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const hasSelected = selectedTodos.size > 0;

  return (
    <div className="space-y-6">
      {todos.length > 0 && (
        <Card className="bg-gray-50 dark:bg-gray-800   px-2.5 py-2.5 sm:px-4 ">
          <CardContent className="  p-0">
            <div className=" flex  gap-2 flex-col sm:flex-row  p-0">
              <div className="flex items-center gap-2 md:gap-4  sm:mb-0">
                <Checkbox
                  checked={selectedTodos.size === todos.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium truncate">
                  {selectedTodos.size > 0
                    ? `${selectedTodos.size} selected`
                    : "Select all"}
                </span>
              </div>
              {hasSelected && (
                <div className="flex gap-2 justify-between ">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkComplete}
                    className={
                      showCompleted
                        ? "text-orange-600 hover:text-orange-700 bg-transparent"
                        : "text-green-600 hover:text-green-700 bg-transparent"
                    }
                  >
                    {showCompleted ? (
                      <>
                        <Package className="w-4 h-4 mr-1" />
                        Mark as Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Complete Selected
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {todos?.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={() => handleDelete(todo.id)}
            onEdit={onEdit}
            isSelected={selectedTodos.has(todo.id)}
            onBulkSelect={handleBulkSelect}
            showCompleted={showCompleted}
            deleteDisabled={deletingId === todo.id}
          />
        ))}
      </div>
    </div>
  );
}

function TodoCard({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isSelected,
  onBulkSelect,
  showCompleted = false,
  deleteDisabled = false,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: () => void;
  onEdit: (todo: Todo) => void;
  isSelected: boolean;
  onBulkSelect: (id: string, checked: boolean) => void;
  showCompleted?: boolean;
  deleteDisabled?: boolean;
}) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? "opacity-75 bg-gray-50 dark:bg-gray-800"
          : "bg-white dark:bg-gray-900"
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onBulkSelect(todo.id, !!checked)}
              className="mt-1"
              title="Select for bulk operations"
            />
            <div className="space-y-1">
              <CardTitle
                className={`text-lg ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {todo.modalName}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  {todo.inventoryType}
                </Badge>

                {todo.completed && (
                  <Badge
                    variant="default"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(todo.id)}
                className={
                  showCompleted
                    ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    : "text-green-600 hover:text-green-700 hover:bg-green-50"
                }
                title={
                  showCompleted ? "Mark as incomplete" : "Mark as completed"
                }
              >
                {showCompleted ? (
                  <Package className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(todo)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Edit todo"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Delete todo"
                disabled={deleteDisabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 grid grid-cols-6 gap-2">
        <div className="space-y-3  col-span-4 ">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-medium">{todo.location}</span>
            <span className="mx-2">•</span>
            <span>{todo.subLocation}</span>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <FileText className="w-4 h-4 mr-2 mt-0.5" />
            <span>{todo.description}</span>
          </div>

          <div className="text-xs text-gray-400">
            Created {format(todo.createdAt, "MMM dd, yyyy 'at' h:mm a")}
          </div>
        </div>
        {todo.image && (
              <div className=" col-span-2 w-full">
                <ImageDialog src={todo.image}>
                  <div className=" w-full overflow-hidden   h-full ">
                    <Image
                      src={todo.image}
                      alt="Todo attachment"
                      className=" w-full h-auto  rounded-md border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      width={50}
                      height={50}
                    />
                  </div>
                </ImageDialog>
              </div>
            )}
      </CardContent>
    </Card>
  );
}
