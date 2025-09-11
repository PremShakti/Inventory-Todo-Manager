"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Settings, LogOut } from "lucide-react";
import { SettingSelectForm } from "@/components/setting-select-form";

export interface Todo {
  id: string;
  inventoryType: string;
  modalName: string;
  location: string;
  subLocation: string;
  description: string;
  customDescription?: string;
  date: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<{ inventoryTypes: string[]; locations: string[]; descriptions: string[] } | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Fetch todos and settings on mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      toast.loading("Loading todos...");
      try {
        const res = await axios.get("/api/todos");
        setTodos(res.data.map((t: any) => ({ ...t, id: t._id, _id: undefined })));
      } catch (err) {
        toast.error("Failed to fetch todos");
      } finally {
        toast.dismiss();
        setLoading(false);
      }
    };
    fetchTodos();
    fetchSettings();
  }, []);

  // Fetch settings
  const fetchSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const res = await axios.get("/api/settings");
      setSettings(res.data);
    } catch (err) {
      setSettingsError("Failed to load settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Open settings dialog
  const openSettings = () => {
    setSettingsDialogOpen(true);
  };

  const addOrUpdateTodo = async (
    data: Todo | Omit<Todo, "id" | "completed" | "createdAt">
  ) => {
    setLoading(true);
    toast.loading("Saving todo...");
    try {
      if ("id" in data) {
        // Update existing todo
        await axios.put("/api/todos", { ...data, id: data.id });
        setTodos((prev) => prev.map((todo) => (todo.id === data.id ? (data as Todo) : todo)));
        toast.success("Todo updated");
        setEditingTodo(null);
        setIsDialogOpen(false);
      } else {
        // Add new todo
        await axios.post("/api/todos", data);
        // Refetch todos for consistency
        const res = await axios.get("/api/todos");
        setTodos(res.data.map((t: any) => ({ ...t, id: t._id, _id: undefined })));
        toast.success("Todo added");
        setIsDialogOpen(false);
      }
    } catch (err) {
      toast.error("Failed to save todo");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const toggleTodo = async (id: string) => {
    setLoading(true);
    toast.loading("Updating todo...");
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      await axios.put("/api/todos", { ...todo, completed: !todo.completed, id });
      setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
      toast.success("Todo updated");
    } catch {
      toast.error("Failed to update todo");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setLoading(true);
    toast.loading("Deleting todo...");
    try {
      await axios.delete("/api/todos", { data: { id } });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast.success("Todo deleted");
    } catch {
      toast.error("Failed to delete todo");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const bulkComplete = async (ids: string[]) => {
    setLoading(true);
    toast.loading("Marking todos as complete...");
    try {
      await Promise.all(
        ids.map((id) => {
          const todo = todos.find((t) => t.id === id);
          if (!todo) return Promise.resolve();
          return axios.put("/api/todos", { ...todo, completed: true, id });
        })
      );
      setTodos((prev) => prev.map((todo) => (ids.includes(todo.id) ? { ...todo, completed: true } : todo)));
      toast.success("Todos marked as complete");
    } catch {
      toast.error("Failed to update todos");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const bulkDelete = async (ids: string[]) => {
    setLoading(true);
    toast.loading("Deleting todos...");
    try {
      await axios.delete("/api/todos", { data: { ids } });
      setTodos((prev) => prev.filter((todo) => !ids.includes(todo.id)));
      toast.success("Todos deleted");
    } catch {
      toast.error("Failed to delete todos");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const markAsIncomplete = async (id: string) => {
    setLoading(true);
    toast.loading("Marking as incomplete...");
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      await axios.put("/api/todos", { ...todo, completed: false, id });
      setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: false } : t));
      toast.success("Todo marked as incomplete");
    } catch {
      toast.error("Failed to update todo");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const bulkMarkIncomplete = async (ids: string[]) => {
    setLoading(true);
    toast.loading("Marking todos as incomplete...");
    try {
      await Promise.all(
        ids.map((id) => {
          const todo = todos.find((t) => t.id === id);
          if (!todo) return Promise.resolve();
          return axios.put("/api/todos", { ...todo, completed: false, id });
        })
      );
      setTodos((prev) => prev.map((todo) => (ids.includes(todo.id) ? { ...todo, completed: false } : todo)));
      toast.success("Todos marked as incomplete");
    } catch {
      toast.error("Failed to update todos");
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  // Skeleton component for loading state
  function TodoListSkeleton() {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white/60 dark:bg-gray-700 rounded-lg p-4 flex flex-col gap-2 shadow">
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-500 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-500 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Add item to a list
  const addSettingItem = (key: "inventoryTypes" | "locations" | "descriptions", value: string) => {
    if (!settings) return;
    if (!value.trim() || settings[key].includes(value.trim())) return;
    setSettings({ ...settings, [key]: [...settings[key], value.trim()] });
  };

  // Delete item from a list
  const deleteSettingItem = (key: "inventoryTypes" | "locations" | "descriptions", value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: settings[key].filter((v) => v !== value) });
  };

  // Save settings
  const saveSettings = async () => {
    if (!settings) return;
    setSettingsSaving(true);
    try {
      await axios.post("/api/settings", settings);
      toast.success("Settings saved");
      setSettingsDialogOpen(false);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className=" space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inventory Todo Manager
            </h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={openSettings} title="Settings">
                <Settings className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="w-6 h-6" />
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Organize and track your inventory tasks efficiently
          </p>
        </div>

        <div className="flex justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {editingTodo ? "Edit Task" : "Add New Task"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTodo ? "Edit Todo" : "Create New Todo"}
                </DialogTitle>
                <DialogDescription>
                  {editingTodo
                    ? "Update the task details below"
                    : "Fill out the form below to add a new inventory task"}
                </DialogDescription>
              </DialogHeader>
              <TodoForm
                key={editingTodo ? editingTodo.id : "new"}
                onSubmit={addOrUpdateTodo}
                editingTodo={editingTodo}
                onCancel={() => {
                  setEditingTodo(null);
                  setIsDialogOpen(false);
                }}
                inventoryTypes={settings?.inventoryTypes || []}
                locations={settings?.locations || []}
                descriptions={settings?.descriptions || []}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Settings Dialog */}
        <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Manage select list options for your inventory tasks.</DialogDescription>
            </DialogHeader>
            {settingsLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : settingsError ? (
              <div className="text-center text-red-500 py-8">{settingsError}</div>
            ) : settings ? (
              <div className="space-y-6">
                <SettingSelectForm
                  label="Inventory Types"
                  apiKey="inventoryTypes"
                  values={settings.inventoryTypes}
                  onChange={vals => setSettings(s => s ? { ...s, inventoryTypes: vals } : s)}
                />
                <SettingSelectForm
                  label="Locations"
                  apiKey="locations"
                  values={settings.locations}
                  onChange={vals => setSettings(s => s ? { ...s, locations: vals } : s)}
                />
                <SettingSelectForm
                  label="Descriptions"
                  apiKey="descriptions"
                  values={settings.descriptions}
                  onChange={vals => setSettings(s => s ? { ...s, descriptions: vals } : s)}
                />
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSettingsDialogOpen(false)} disabled={settingsSaving}>Close</Button>
                  {/* <Button onClick={saveSettings} disabled={settingsSaving}>
                    {settingsSaving ? (
                      <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-t-transparent border-blue-600 rounded-full" /> Saving...</span>
                    ) : (
                      "Save"
                    )}
                  </Button> */}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="mb-4">No settings found. Please add at least one value for each list and save.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Tasks ({pendingTodos.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Tasks ({completedTodos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading && todos.length === 0 ? (
              <TodoListSkeleton />
            ) : (
              <TodoList
                todos={pendingTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={(todo) => {
                  setEditingTodo(todo);
                  setIsDialogOpen(true);
                }}
                onBulkComplete={bulkComplete}
                onBulkDelete={bulkDelete}
                showCompleted={false}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {loading && todos.length === 0 ? (
              <TodoListSkeleton />
            ) : (
              <TodoList
                todos={completedTodos}
                onToggle={markAsIncomplete}
                onDelete={deleteTodo}
                onEdit={(todo) => {
                  setEditingTodo(todo);
                  setIsDialogOpen(true);
                }}
                onBulkComplete={bulkMarkIncomplete}
                onBulkDelete={bulkDelete}
                showCompleted={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
