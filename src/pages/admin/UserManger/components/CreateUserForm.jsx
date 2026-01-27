import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import React, { useEffect, useRef, useState } from "react";
import { useCreateUser, useRoles, useUpdateUser } from "@/hooks/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UploadAvatar } from "@/components/ui/upload-avatar";
import { fileFolder, fileService } from "@/lib/api/services/file.service";
import { Textarea } from "@/components/ui/textarea";
import { imgUrl } from "@/lib/enviroment";

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
  phone_number: z.string().min(1, "Phone number is required"),
  parent_number: z.string().min(1, "Parent number is required"),
  gender: z.string(),
  address: z.string().optional(),
});

const editUserSchema = userFormSchema.extend({
  password: z.string().min(0).max(30).optional(),
});


const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const CreateUserForm = ({ isModalOpen, setIsModalOpen, currentUser }) => {
  const queryClient = useQueryClient();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const { data: roles } = useRoles()


  const { handleSubmit, reset, formState: { errors }, setValue, register, watch, formState } = useForm({
    resolver: zodResolver(currentUser ? editUserSchema : userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      role: "",
      phone_number: "",
      parent_number: "",
      gender: "",
      address: ""
    },
  });

  const [avatarfile, setAvatarFile] = useState(null);

  useEffect(() => {

    if (currentUser) {
      reset({
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        role: String(currentUser?.role?.id),
        phone_number: currentUser.phone_number,
        parent_number: currentUser.parent_number,
        gender: currentUser.gender,
        address: currentUser.address,
        password: ""
      });
      return
    }

    if (isModalOpen && !currentUser) {
      reset({
        avatar: null,
        first_name: "",
        last_name: "",
        password: "",
        role: "",
        phone_number: "",
        parent_number: "",
        gender: "",
      });
    }
  }, [isModalOpen]);


  const onSubmit = async (values) => {
    try {
      if (avatarfile) {
        const uploadedAvatar = await fileService.uploadFile(avatarfile, fileFolder.AVATAR);
        values.avatar = uploadedAvatar.data.url;
      }

      const payload = {
        ...values,
        role: parseInt(values.role),
        gender: values.gender || undefined,
      };

      if (currentUser) {
        console.log({ id: currentUser.id, payload })
        const filteredPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, value]) => value !== null && value !== "")
        );
        updateMutation.mutate({ id: currentUser.id, userData: filteredPayload }, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsModalOpen(false);
            toast.success("User updated successfully");
            reset();
            setAvatarFile(null);
          },
        });
      } else {
        createMutation.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsModalOpen(false);
            toast.success("User created successfully");
            reset();
            setAvatarFile(null);
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            បង្កើតអ្នកប្រើប្រាស់ថ្មី (Create New User)
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Fill out the form to create a new user.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {/* ───────── Personal Information ───────── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Personal Information
            </h4>

            <UploadAvatar onChange={(file) => setAvatarFile(file)} previewUrl={currentUser?.avatar ? imgUrl + currentUser?.avatar : null} />


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <FieldGroup className={'gap-2'}>
                <FieldLabel className="text-sm" htmlFor="first_name">
                  First Name <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="first_name"
                    {...register("first_name")}
                    placeholder="John"
                    className="text-sm"
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-500">
                      {errors.first_name.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>

              {/* Last Name */}
              <FieldGroup className={'gap-2'}>
                <FieldLabel className="text-sm" htmlFor="last_name">
                  Last Name <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="last_name"
                    {...register("last_name")}
                    placeholder="Doe"
                    className="text-sm"
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-500">
                      {errors.last_name.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>

              {/* Phone Number */}
              <FieldGroup className="gap-2">
                <FieldLabel className="text-sm" htmlFor="phone_number">
                  Phone Number <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    id="phone_number"
                    {...register("phone_number")}
                    placeholder="012 345 678"
                    className="text-sm no-spinner"
                  />
                  {errors.phone_number && (
                    <p className="text-xs text-red-500">
                      {errors.phone_number.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>

              {/* Parent Number */}
              <FieldGroup className={'gap-2'}>
                <FieldLabel className="text-sm" htmlFor="parent_number">
                  Parent Number <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    id="parent_number"
                    {...register("parent_number")}
                    placeholder="012 345 678"
                    className="text-sm no-spinner"

                  />
                  {errors.parent_number && (
                    <p className="text-xs text-red-500">
                      {errors.parent_number.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>
            </div>
          </div>

          {/* ───────── Account Information ───────── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Account Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <FieldGroup className="gap-2 sm:col-span-2">
                <FieldLabel className="text-sm" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password")}
                    placeholder="Enter password"
                    className="text-sm"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>

              {/* Role */}
              <FieldGroup className="gap-2">
                <FieldLabel className="text-sm" htmlFor="role">
                  Role <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={watch("role")}
                    onValueChange={(val) => setValue("role", val, { shouldValidate: true })}
                    className="text-sm"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles?.data?.map((role) => (
                        <SelectItem className="flex" key={role.id} value={String(role.id)}>
                          <div className="w-full flex">
                            <span>{role?.name}</span>
                            <span className="text-[8px] ms-1 text-muted-foreground">({role?.user_count})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState.errors.role && (
                    <p className="text-xs text-red-500">
                      {formState.errors.role.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>

              {/* Gender */}
              <FieldGroup className="gap-2">
                <FieldLabel className="text-sm" htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Select
                    value={watch("gender")}
                    onValueChange={(val) => setValue("gender", val)}
                    className="text-sm"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </FieldContent>
              </FieldGroup>
            </div>

            <FieldGroup className="gap-2">
              <FieldLabel className="text-sm" htmlFor="address">
                Address
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="address"
                  {...register("address")}
                  placeholder="Enter address"
                  className="text-sm"
                  rows={3}
                />
              </FieldContent>
            </FieldGroup>
          </div>

          {/* ───────── FOOTER ───────── */}
          <DialogFooter className="mt-6 flex justify-end gap-2">
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
              {
                createMutation.isPending ? "loading..." : currentUser ? "Update User" : "Create User"
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  );
};

export default CreateUserForm;
