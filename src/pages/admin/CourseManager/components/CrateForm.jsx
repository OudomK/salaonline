import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import React, { useEffect } from 'react'
import { useCreateCourse, useUpdateCourse } from '@/hooks/api'
import { useQueryClient } from '@tanstack/react-query'
import { FileDropzone } from '@/components/ui/file-dropzone'
import { toast } from 'sonner'
import { imgUrl } from '@/lib/enviroment'
import { fileFolder, fileService } from '@/lib/api/services/file.service'

const courseFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    thumbnail: z.any().optional(),
    category_id: z.string().min(1, 'Category is required'),
    teacher_id: z.string().min(1, 'Teacher is required'),
})


const CrateForm = ({ isModalOpen, setIsModalOpen, currentCourse }) => {
    const queryClient = useQueryClient();
    const createMutation = useCreateCourse();
    const updateMutation = useUpdateCourse();

    const form = useForm({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            title: '',
            description: '',
            category_id: '',
            teacher_id: '',
            thumbnail: null,
        },
    })

    useEffect(() => {
        if (isModalOpen) {
            if (currentCourse) {
                form.reset({
                    title: currentCourse.title || '',
                    description: currentCourse.description || '',
                    category_id: currentCourse.category_id?.toString() || '',
                    teacher_id: currentCourse.teacher_id?.toString() || '',
                    thumbnail: currentCourse.thumbnail || null,
                });
            } else {
                form.reset({
                    title: '',
                    description: '',
                    category_id: '',
                    teacher_id: '',
                    thumbnail: null,
                });
            }
        }
    }, [currentCourse, isModalOpen, form]);

    // Debug: Watch thumbnail value
    const thumbnailValue = form.watch("thumbnail");
    useEffect(() => {
        console.log('🔍 CrateForm - Thumbnail value:', thumbnailValue);
        console.log('🔍 CrateForm - imgUrl:', imgUrl);
        console.log('🔍 CrateForm - Full preview URL:', thumbnailValue && typeof thumbnailValue === 'string' ? `${imgUrl}${thumbnailValue}` : null);
    }, [thumbnailValue]);


    const onSubmit = async (values) => {
        try {
            console.log('Form values before submit:', values);

            const formData = { ...values };


            if (values.thumbnail) {
                const uploadedThumbnail = await fileService.uploadFile(
                    values.thumbnail,
                    fileFolder.COURSE_THUMBNAIL
                );

                formData.thumbnail = uploadedThumbnail.data.url;
            }

            const onSuccess = () => {
                queryClient.invalidateQueries({ queryKey: ['courses'] });
                setIsModalOpen(false);
                toast.success(currentCourse ? 'Course updated successfully' : 'Course created successfully');
                form.reset();
            };

            const onError = (error) => {
                console.error('Submit failed:', error);
                toast.error(error.response?.data?.message || 'Operation failed');
            };

            if (currentCourse) {
                updateMutation.mutate(
                    { id: currentCourse.id, courseData: formData },
                    { onSuccess, onError }
                );
            } else {
                createMutation.mutate(formData, { onSuccess, onError });
            }

        } catch (err) {
            console.error(err);
            toast.error('Unexpected error occurred');
        }
    };



    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">
                        {currentCourse ? 'កែប្រែវគ្គសិក្សា' : 'បង្កើតវគ្គសិក្សាថ្មី'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-3">
                    {/* Title */}
                    <FieldGroup>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <FieldContent>
                            <Input
                                id="title"
                                {...form.register('title')}
                                placeholder="Enter title"
                                className="text-sm"
                            />
                            {form.formState.errors.title && (
                                <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
                            )}
                        </FieldContent>

                    </FieldGroup>

                    {/* Description */}
                    <FieldGroup>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <FieldContent>
                            <Textarea
                                id="description"
                                {...form.register('description')}
                                placeholder="Enter description"
                                className="text-sm resize-none h-16"
                            />
                            {form.formState.errors.description && (
                                <p className="text-red-500 text-xs mt-1">{form.formState.errors.description.message}</p>
                            )}
                        </FieldContent>

                    </FieldGroup>

                    {/* Thumbnail */}
                    <FieldGroup>
                        <FieldLabel>Thumbnail</FieldLabel>
                        <FieldContent>
                            <FileDropzone
                                multiple={false}
                                accept="image/*"
                                value={form.watch("thumbnail")}
                                previewUrl={
                                    form.watch("thumbnail") && typeof form.watch("thumbnail") === 'string'
                                        ? `${imgUrl}${form.watch("thumbnail")}`
                                        : null
                                }
                                onChange={(file) =>
                                    form.setValue("thumbnail", file, { shouldValidate: true })
                                }
                                error={form.formState.errors.thumbnail?.message}
                                label="Course thumbnail"
                            />
                        </FieldContent>
                    </FieldGroup>


                    {/* Category */}
                    <FieldGroup>
                        <FieldLabel htmlFor="category_id">Category</FieldLabel>
                        <FieldContent>
                            <Select
                                {...form.register('category_id')}
                                value={form.watch('category_id')}
                                onValueChange={(val) => form.setValue('category_id', val)}
                                className="text-sm"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1" className="flex items-center space-x-2">
                                        <img
                                            src="/images/category1.jpg"
                                            alt="Category 1"
                                            className="w-6 h-6 rounded-sm"
                                        />
                                        <span>Category 1</span>
                                    </SelectItem>
                                    <SelectItem value="2" className="flex items-center space-x-2">
                                        <img
                                            src="/images/category2.jpg"
                                            alt="Category 2"
                                            className="w-6 h-6 rounded-sm"
                                        />
                                        <span>Category 2</span>
                                    </SelectItem>
                                    <SelectItem value="3" className="flex items-center space-x-2">
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
                                <p className="text-red-500 text-xs ">{form.formState.errors.category_id.message}</p>
                            )}
                        </FieldContent>

                    </FieldGroup>

                    {/* Teacher */}
                    <FieldGroup>
                        <FieldLabel htmlFor="teacher_id">Teacher</FieldLabel>
                        <FieldContent>
                            <Select
                                {...form.register('teacher_id')}
                                value={form.watch('teacher_id')}
                                onValueChange={(val) => form.setValue('teacher_id', val)}
                                className="text-sm"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="31" className="flex items-center space-x-2">
                                        <img
                                            src="/images/teacher31.jpg"
                                            alt="Teacher 31"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>Teacher 31</span>
                                    </SelectItem>
                                    <SelectItem value="32" className="flex items-center space-x-2">
                                        <img
                                            src="/images/teacher32.jpg"
                                            alt="Teacher 32"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>Teacher 32</span>
                                    </SelectItem>
                                    <SelectItem value="33" className="flex items-center space-x-2">
                                        <img
                                            src="/images/teacher33.jpg"
                                            alt="Teacher 33"
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>Teacher 33</span>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {form.formState.errors.teacher_id && (
                                <p className="text-red-500 text-xs mt-1">{form.formState.errors.teacher_id.message}</p>
                            )}
                        </FieldContent>

                    </FieldGroup>


                    <DialogFooter className="mt-2 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CrateForm
