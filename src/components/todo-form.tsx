"use client"

import type React from "react"
import type { Todo } from "@/app/page"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Save, X } from "lucide-react"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TodoFormProps {
  onSubmit: (data: Todo | Omit<Todo, "id" | "completed" | "createdAt">) => void
  editingTodo?: Todo | null
  onCancel?: () => void
  inventoryTypes: string[]
  locations: string[]
  descriptions: string[]
}

const addTodoSchema = z.object({
  inventoryType: z.string().min(1, "Inventory type is required"),
  modalName: z.string().min(1, "Modal name is required").max(55, "Modal name must be at most 55 characters"),
  location: z.string().min(1, "Location is required"),
  subLocation: z.string().min(1, "Sub location is required").max(55, "Sub location must be at most 55 characters"),
  description: z.string().min(1, "Description is required"),
  customDescription: z.string().optional(),
});

const editTodoSchema = z.object({
  inventoryType: z.string().optional(),
  modalName: z.string().max(55, "Modal name must be at most 55 characters").optional(),
  location: z.string().optional(),
  subLocation: z.string().max(55, "Sub location must be at most 55 characters").optional(),
  description: z.string().optional(),
  customDescription: z.string().optional(),
});

export function TodoForm({ onSubmit, editingTodo, onCancel, inventoryTypes, locations, descriptions }: TodoFormProps) {
  const schema = editingTodo ? editTodoSchema : addTodoSchema;
  const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema.refine(
      (data) => data.description !== "Other" || (data.customDescription && data.customDescription.length > 0),
      {
        message: "Custom description is required when 'Other' is selected",
        path: ["customDescription"],
      }
    )),
    defaultValues: {
      inventoryType: "",
      modalName: "",
      location: "",
      subLocation: "",
      description: "",
      customDescription: "",
    },
  });

  const descriptionValue = watch("description");
  const showCustomDescription = descriptionValue === "Other";

  useEffect(() => {
    if (editingTodo) {
      reset({
        inventoryType: editingTodo.inventoryType,
        modalName: editingTodo.modalName,
        location: editingTodo.location,
        subLocation: editingTodo.subLocation,
        description: editingTodo.customDescription ? "Other" : editingTodo.description,
        customDescription: editingTodo.customDescription || "",
      });
    } else {
      reset();
    }
  }, [editingTodo, inventoryTypes, locations, descriptions, reset]);

  const onFormSubmit = (data: any) => {
    const finalDescription = data.description === "Other" ? data.customDescription : data.description;
    if (editingTodo) {
      onSubmit({
        ...editingTodo,
        inventoryType: data.inventoryType,
        modalName: data.modalName,
        location: data.location,
        subLocation: data.subLocation,
        description: finalDescription,
        customDescription: data.description === "Other" ? data.customDescription : undefined,
      });
    } else {
      onSubmit({
        ...data,
        description: finalDescription,
        customDescription: data.description === "Other" ? data.customDescription : undefined,
      });
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inventory Type */}
        <div className="space-y-2">
          <Label htmlFor="inventoryType" className="text-sm font-medium">
            Inventory Type *
          </Label>
          <Controller
            name="inventoryType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inventory type" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.inventoryType && <p className="text-red-500 text-xs">{errors.inventoryType.message as string}</p>}
        </div>
        {/* Modal Name */}
        <div className="space-y-2">
          <Label htmlFor="modalName" className="text-sm font-medium">
            Modal Name *
          </Label>
          <Input
            id="modalName"
            placeholder="Enter modal name"
            maxLength={55}
            {...register("modalName")}
          />
          {errors.modalName && <p className="text-red-500 text-xs">{errors.modalName.message as string}</p>}
        </div>
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location *
          </Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.location && <p className="text-red-500 text-xs">{errors.location.message as string}</p>}
        </div>
        {/* Sub Location */}
        <div className="space-y-2">
          <Label htmlFor="subLocation" className="text-sm font-medium">
            Sub Location *
          </Label>
          <Input
            id="subLocation"
            placeholder="Enter sub location"
            maxLength={55}
            {...register("subLocation")}
          />
          {errors.subLocation && <p className="text-red-500 text-xs">{errors.subLocation.message as string}</p>}
        </div>
      </div>
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description *
        </Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select description" />
              </SelectTrigger>
              <SelectContent>
                {descriptions.map((desc) => (
                  <SelectItem key={desc} value={desc}>
                    {desc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message as string}</p>}
      </div>
      {/* Custom Description (conditional) */}
      {showCustomDescription && (
        <div className="space-y-2">
          <Label htmlFor="customDescription" className="text-sm font-medium">
            Custom Description *
          </Label>
          <Textarea
            id="customDescription"
            placeholder="Enter your custom description..."
            className="min-h-[100px] resize-none"
            {...register("customDescription")}
          />
          {errors.customDescription && <p className="text-red-500 text-xs">{errors.customDescription.message as string}</p>}
        </div>
      )}
      <div className="flex gap-3">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
          {editingTodo ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Todo
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Todo Item
            </>
          )}
        </Button>
        {editingTodo && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
