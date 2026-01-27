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
import React, { useEffect, useRef } from "react";
import { useCreateUser } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const userFormSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must not exceed 30 characters"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone_number: z.string().min(1, "Phone number is required"),
  parent_number: z.string().min(1, "Parent number is required"),
  gender: z.string().optional(),
});

const ROLES = [
  { value: "1", label: "Admin" },
  { value: "2", label: "Teacher" },
  { value: "3", label: "Student" },
  { value: "4", label: "Staff" },
];

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const CreateUserForm = ({ isModalOpen, setIsModalOpen }) => {
  const queryClient = useQueryClient();
  const createMutation = useCreateUser();

  // Use ref to track if error has been shown to avoid duplicate toasts
  const createErrorShown = useRef(false);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      role: "",
      email: "",
      phone_number: "",
      parent_number: "",
      gender: "",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        first_name: "",
        last_name: "",
        password: "",
        role: "",
        email: "",
        phone_number: "",
        parent_number: "",
        gender: "",
      });
    }
  }, [isModalOpen, form]);

  // Watch for create mutation errors
  useEffect(() => {
    if (createMutation.error && !createErrorShown.current) {
      console.error("Create mutation error:", createMutation.error);
      const errorMessage =
        createMutation.error?.response?.data?.message ||
        createMutation.error?.message ||
        createMutation.error?.data?.message ||
        "Failed to create user";
      toast.error(errorMessage);
      createErrorShown.current = true;
    }
    if (!createMutation.error) {
      createErrorShown.current = false;
    }
  }, [createMutation.error]);

  const onSubmit = async (values) => {
    try {
      // Reset error flag before submitting
      createErrorShown.current = false;

      console.log("Form values before submit:", values);

      const formData = {
        ...values,
        role: parseInt(values.role, 10),
        email: values.email || undefined,
        gender: values.gender || undefined,
      };

      const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setIsModalOpen(false);
        toast.success("User created successfully");
        form.reset();
      };

      createMutation.mutate(formData, { onSuccess });
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create New User)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
          {/* First Name */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="first_name">
              First Name *
            </FieldLabel>
            <FieldContent>
              <Input
                id="first_name"
                {...form.register("first_name")}
                placeholder="Enter first name"
                className="text-sm"
              />
              {form.formState.errors.first_name && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.first_name.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Last Name */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="last_name">
              Last Name *
            </FieldLabel>
            <FieldContent>
              <Input
                id="last_name"
                {...form.register("last_name")}
                placeholder="Enter last name"
                className="text-sm"
              />
              {form.formState.errors.last_name && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.last_name.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Password */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="password">
              Password *
            </FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                placeholder="Enter password"
                className="text-sm"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.password.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Email */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="email">
              Email
            </FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="Enter email (optional)"
                className="text-sm"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.email.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Phone Number */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="phone_number">
              Phone Number *
            </FieldLabel>
            <FieldContent>
              <Input
                id="phone_number"
                {...form.register("phone_number")}
                placeholder="Enter phone number"
                className="text-sm"
              />
              {form.formState.errors.phone_number && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.phone_number.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Parent Number */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="parent_number">
              Parent Number *
            </FieldLabel>
            <FieldContent>
              <Input
                id="parent_number"
                {...form.register("parent_number")}
                placeholder="Enter parent number"
                className="text-sm"
              />
              {form.formState.errors.parent_number && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.parent_number.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Role */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="role">
              Role *
            </FieldLabel>
            <FieldContent>
              <Select
                {...form.register("role")}
                value={form.watch("role")}
                onValueChange={(val) => form.setValue("role", val)}
                className="text-sm"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.role.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          {/* Gender */}
          <FieldGroup className="flex gap-1">
            <FieldLabel className="text-sm" htmlFor="gender">
              Gender
            </FieldLabel>
            <FieldContent>
              <Select
                {...form.register("gender")}
                value={form.watch("gender")}
                onValueChange={(val) => form.setValue("gender", val)}
                className="text-sm"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.gender.message}
                </p>
              )}
            </FieldContent>
          </FieldGroup>

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
