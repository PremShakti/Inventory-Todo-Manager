"use client";

import type React from "react";
import type { Todo } from "@/app/page";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Save, X, Upload, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TodoFormProps {
  onSubmit: (data: Todo | Omit<Todo, "id" | "completed" | "createdAt">) => void;
  editingTodo?: Todo | null;
  onCancel?: () => void;
  inventoryTypes: string[];
  locations: string[];
  descriptions: string[];
}

const addTodoSchema = z.object({
  inventoryType: z.string().min(1, "Inventory type is required"),
  modalName: z
    .string()
    .min(1, "Modal name is required")
    .max(55, "Modal name must be at most 55 characters"),
  location: z.string().min(1, "Location is required"),
  subLocation: z
    .string()
    .min(1, "Sub location is required")
    .max(55, "Sub location must be at most 55 characters"),
  description: z.string().min(1, "Description is required"),
  customDescription: z.string().optional(),
  image: z.string().optional(),
});

const editTodoSchema = z.object({
  inventoryType: z.string().optional(),
  modalName: z
    .string()
    .max(55, "Modal name must be at most 55 characters")
    .optional(),
  location: z.string().optional(),
  subLocation: z
    .string()
    .max(55, "Sub location must be at most 55 characters")
    .optional(),
  description: z.string().optional(),
  customDescription: z.string().optional(),
  image: z.string().optional(),
});

// Image compression utility
const compressImage = (file: File, maxSizeKB = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      let { width, height } = img;

      // Calculate new dimensions
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      // Start with quality 0.9 and reduce until under 1MB
      let quality = 0.9;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);

      while (dataUrl.length * 0.75 / 1024 > maxSizeKB && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      if (dataUrl.length * 0.75 / 1024 > maxSizeKB) {
        reject(new Error("Unable to compress image below 1MB"));
      } else {
        resolve(dataUrl);
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

export function TodoForm({
  onSubmit,
  editingTodo,
  onCancel,
  inventoryTypes,
  locations,
  descriptions,
}: TodoFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const schema = editingTodo ? editTodoSchema : addTodoSchema;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      schema.refine(
        (data) =>
          data.description !== "Other" ||
          (data.customDescription && data.customDescription.length > 0),
        {
          message: "Custom description is required when 'Other' is selected",
          path: ["customDescription"],
        }
      )
    ),
    defaultValues: {
      inventoryType: "",
      modalName: "",
      location: "",
      subLocation: "",
      description: "",
      customDescription: "",
      image: "",
    },
  });

  const descriptionValue = watch("description");
  const showCustomDescription = descriptionValue === "Other";
  const imageValue = watch("image");

  useEffect(() => {
    if (editingTodo) {
      reset({
        inventoryType: editingTodo.inventoryType,
        modalName: editingTodo.modalName,
        location: editingTodo.location,
        subLocation: editingTodo.subLocation,
        description: editingTodo.customDescription
          ? "Other"
          : editingTodo.description,
        customDescription: editingTodo.customDescription || "",
        image: (editingTodo as any).image || "",
      });
      setImagePreview((editingTodo as any).image || null);
    } else {
      reset();
      setImagePreview(null);
    }
  }, [editingTodo, inventoryTypes, locations, descriptions, reset]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImageLoading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setValue("image", compressedBase64);
      setImagePreview(compressedBase64);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to process image");
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = () => {
    setValue("image", "");
    setImagePreview(null);
  };

  const onFormSubmit = (data: any) => {
    const finalDescription =
      data.description === "Other" ? data.customDescription : data.description;
    if (editingTodo) {
      onSubmit({
        ...editingTodo,
        inventoryType: data.inventoryType,
        modalName: data.modalName,
        location: data.location,
        subLocation: data.subLocation,
        description: finalDescription,
        customDescription:
          data.description === "Other" ? data.customDescription : undefined,
        image: data.image || undefined,
      } as any);
    } else {
      onSubmit({
        ...data,
        description: finalDescription,
        customDescription:
          data.description === "Other" ? data.customDescription : undefined,
        image: data.image || undefined,
      });
      reset();
      setImagePreview(null);
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
          {errors.inventoryType && (
            <p className="text-red-500 text-xs">
              {errors.inventoryType.message as string}
            </p>
          )}
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
          {errors.modalName && (
            <p className="text-red-500 text-xs">
              {errors.modalName.message as string}
            </p>
          )}
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
          {errors.location && (
            <p className="text-red-500 text-xs">
              {errors.location.message as string}
            </p>
          )}
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
          {errors.subLocation && (
            <p className="text-red-500 text-xs">
              {errors.subLocation.message as string}
            </p>
          )}
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
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-xs">
            {errors.description.message as string}
          </p>
        )}
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
          {errors.customDescription && (
            <p className="text-red-500 text-xs">
              {errors.customDescription.message as string}
            </p>
          )}
        </div>
      )}
      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-medium">
          Upload Image (Optional)
        </Label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageLoading}
              className="hidden"
              id="image-upload"
            />
            <Label
              htmlFor="image-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {imageLoading ? "Processing..." : "Choose Image"}
            </Label>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeImage}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {imagePreview && (
            <div className="relative max-w-xs">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-md border border-gray-200 shadow-sm"
              />
              <div className="mt-1 text-xs text-gray-500">
                Size: {Math.round((imagePreview.length * 0.75) / 1024)} KB
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
