import { AlertDialog } from "@/components/ui/alert-dialog";
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
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { useForm } from "react-hook-form";

const userFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.any().optional(),
  category_id: z.string().min(1, "Category is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
});

const CreateForm = ({ isModalOpen, setIsModalOpen }) => {
  const {} = useForm({});
  const currentCourse = false;
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">
              {currentCourse ? "កែប្រែវគ្គសិក្សា" : "បង្កើតវគ្គសិក្សាថ្មី"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 mt-3"
          >
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
                  <p className="text-red-500 text-xs ">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </FieldContent>
            </FieldGroup>

            {/* Role */}
            <FieldGroup className={"flex gap-1"}>
              <FieldLabel htmlFor="role_id">Role</FieldLabel>
              <FieldContent>
                <Select
                  {...form.register("category_id")}
                  value={form.watch("category_id")}
                  onValueChange={(val) => form.setValue("category_id", val)}
                  className="text-sm"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="1"
                      className="flex items-center space-x-2"
                    >
                      <img
                        src="/images/category1.jpg"
                        alt="Category 1"
                        className="w-6 h-6 rounded-sm"
                      />
                      <span>Category 1</span>
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="flex items-center space-x-2"
                    >
                      <img
                        src="/images/category2.jpg"
                        alt="Category 2"
                        className="w-6 h-6 rounded-sm"
                      />
                      <span>Category 2</span>
                    </SelectItem>
                    <SelectItem
                      value="3"
                      className="flex items-center space-x-2"
                    >
                      <img
                        src="/images/category3.jpg"
                        alt="Category 3"
                        className="w-6 h-6 rounded-sm"
                      />
                      <span>Category 3</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category_id && (
                  <p className="text-red-500 text-xs ">
                    {form.formState.errors.category_id.message}
                  </p>
                )}
              </FieldContent>
            </FieldGroup>

            <DialogFooter className="mt-2 flex justify-end space-x-2">
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
    </div>
  );
};

export default CreateForm;
