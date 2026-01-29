import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useRef, useState } from "react";
import { useCreateCourse, useGetTeachers, useUpdateCourse } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { imgUrl } from "@/lib/helper/enviroment";
import { fileFolder, fileService } from "@/lib/api/services/file.service";
import { useCategories } from "@/hooks/api/useCategory";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadAvatar } from "@/components/ui/upload-avatar";

const courseFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.any().optional(),
  category_id: z.string().min(1, "Category is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});

const CrateForm = ({ isModalOpen, setIsModalOpen, currentCourse }) => {
  const queryClient = useQueryClient();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const { data: teachersList } = useGetTeachers(isModalOpen);
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories(isModalOpen);

  const [thumbnail, setThumbnail] = useState(null);

  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category_id: "",
      teacher_id: "",
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      if (currentCourse) {
        form.reset({
          title: currentCourse.title || "",
          description: currentCourse.description || "",
          category_id:
            (
              currentCourse?.category_id || currentCourse?.category?.id
            )?.toString() || "",
          teacher_id:
            (
              currentCourse?.teacher_id || currentCourse?.teacher?.id
            )?.toString() || "",
          thumbnail: currentCourse?.thumbnail || null,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          category_id: "",
          teacher_id: "",
          thumbnail: null,
        });
      }
    }
  }, [currentCourse, isModalOpen, form]);

  const onSubmit = async (values) => {
    try {
      console.log("Form values before submit:", values);

      const formData = { ...values };

      formData.teacher_id = values.teacher_id;

      if (thumbnail) {
        const uploadedThumbnail = await fileService.uploadFile(
          thumbnail,
          fileFolder.COURSE_THUMBNAIL,
        );

        formData.thumbnail = uploadedThumbnail.data.url;
      } else {
        formData.thumbnail = currentCourse?.thumbnail;
      }

      const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsModalOpen(false);
        toast.success(
          currentCourse
            ? "Course updated successfully"
            : "Course created successfully",
        );
        form.reset();
      };

      if (currentCourse) {
        updateMutation.mutate(
          {
            id: currentCourse.id,
            courseData: {
              ...formData,
              thumbnail: formData.thumbnail || currentCourse.thumbnail,
            },
          },
          { onSuccess },
        );
      } else {
        createMutation.mutate(formData, { onSuccess });
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium text-lg">
            {currentCourse ? "កែប្រែវគ្គសិក្សា" : "បង្កើតវគ្គសិក្សាថ្មី"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
          {/* Title */}
          <FieldGroup className={"flex gap-1"}>
            <FieldLabel className="text-sm" htmlFor="title">
              Title
            </FieldLabel>
            <FieldContent>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter title"
                className="text-sm"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.title.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Description */}
          <FieldGroup className={"flex gap-1"}>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Enter description"
                className="h-16 text-sm resize-none"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-red-500 text-xs">
                  {form.formState.errors.description.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Thumbnail */}
          <FieldGroup className={"flex gap-1"}>
            <FieldLabel>Thumbnail</FieldLabel>
            <FieldContent>
              <UploadAvatar
                value={form.watch("thumbnail")}
                className={"w-full h-60 rounded-xl"}
                previewUrl={
                  currentCourse?.thumbnail
                    ? `${imgUrl}${currentCourse.thumbnail}`
                    : null
                }
                onChange={(file) => {
                  if (file) {
                    setThumbnail(file);
                  }
                }}
              />
            </FieldContent>
          </FieldGroup>

          {/* Category */}
          <FieldGroup className={"flex gap-1"}>
            <FieldLabel htmlFor="category_id">Category</FieldLabel>
            <FieldContent>
              <Select
                value={form.watch("category_id")}
                onValueChange={(val) => form.setValue("category_id", val)}
                className="text-sm"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.data?.data?.map((category) => (
                    <SelectItem
                      key={`${category.id} ${category.name}`}
                      value={category.id.toString()}
                      className="flex items-center space-x-2"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={`${imgUrl}${category.thumbnail}`}
                            alt={category.name}
                            className="rounded-sm w-6 h-6"
                          />
                          <AvatarFallback>{category.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category_id && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.category_id.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Teacher */}
          <FieldGroup className={"flex gap-1"}>
            <FieldLabel htmlFor="teacher_id">Teacher</FieldLabel>
            <FieldContent>
              <Select
                value={form.watch("teacher_id")}
                onValueChange={(val) => form.setValue("teacher_id", val)}
                className="text-sm"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachersList?.data?.map((teacher) => (
                    <SelectItem
                      key={`${teacher.id}  + ${teacher.first_name} + ${teacher.id}`}
                      value={teacher?.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            className="object-cover"
                            src={`${imgUrl}${teacher.avatar}`}
                          />
                          <AvatarFallback>
                            {teacher.first_name?.[0]}
                            {teacher.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                          {teacher.first_name} {teacher.last_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.formState.errors.teacher_id && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.teacher_id.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          <DialogFooter className="flex justify-end space-x-2 mt-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CrateForm;
