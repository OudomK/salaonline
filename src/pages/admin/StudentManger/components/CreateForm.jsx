import { AlertDialog } from "@/components/ui/alert-dialog";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateUser, useRoles, useUpdateUser } from "@/hooks/api";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  parent_number: z.string().min(1, "Parent number is required"),
  password: z.string().min(1, "Password is required"),
  role: z.string().min(1, "Role is required"),
  gender: z.string().min(1, "Gender is required"),
});

const CreateForm = ({ isModalOpen, setIsModalOpen, currentUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      parent_number: "",
      password: "",
      role: "",
    }
  });

  const createMutation = useCreateUser();
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles();
  const updateMutation = useUpdateUser();

  const roles = rolesData?.data || [];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    createMutation.mutate(data);
  }



  return (
    <div>
      {/* Create/Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[640px] p-0">
          {/* HEADER */}
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold">
              {currentUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentUser
                ? "Update user information and role"
                : "Fill in the form to create a new user"}
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <form >
            <div className="px-6 py-4 max-h-[65vh] overflow-y-auto space-y-6">

              {/* ───────── Personal Info ───────── */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                  Personal Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1">
                    <Label>First Name *</Label>
                    <Input {...register("first_name")} placeholder="John" />
                    {errors.first_name && (
                      <p className="text-xs text-red-500">{errors.first_name.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <Label>Last Name *</Label>
                    <Input {...register("last_name")} placeholder="Doe" />
                    {errors.last_name && (
                      <p className="text-xs text-red-500">{errors.last_name.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <Label>Phone Number *</Label>
                    <Input {...register("phone_number")} placeholder="012 345 678" />
                    {errors.phone_number && (
                      <p className="text-xs text-red-500">{errors.phone_number.message}</p>
                    )}
                  </div>

                  {/* Parent */}
                  <div className="space-y-1">
                    <Label>Parent Number *</Label>
                    <Input {...register("parent_number")} placeholder="012 345 678" />
                    {errors.parent_number && (
                      <p className="text-xs text-red-500">{errors.parent_number.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ───────── Account Info ───────── */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                  Account Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Password {!currentUser && "*"}</Label>
                    <Input
                      type="password"
                      {...register("password", { required: !currentUser })}
                      placeholder={
                        currentUser
                          ? "Leave empty to keep current"
                          : "Enter password (6–30 characters)"
                      }
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <Label>Role *</Label>
                    <Select onValueChange={(v) => setValue("role", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <Label>Gender</Label>
                    <Select onValueChange={(v) => setValue("gender", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER (sticky) */}
            <DialogFooter className=" bottom-0 bg-background border-t px-6 py-4 flex justify-between">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>

              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-[#00B4F6] hover:bg-[#0099D6]"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {currentUser ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CreateForm;
