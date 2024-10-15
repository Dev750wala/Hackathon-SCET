import React, { useState } from 'react'
import { useForm, useFieldArray, Controller, SubmitHandler } from 'react-hook-form'
import { PlusIcon, XIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';
import { ProjectCreationSuccessResponse } from '@/interfaces'
import { useAppSelector } from '@/redux-store/hooks'
import { useNavigate } from 'react-router-dom'

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
})

interface Judge {
    name: string;
    userId?: string;
}

interface ProjectCreationDetails {
    name: string;
    description: string;
    registrationStart: string;
    registrationEnd: string;
    start: string;
    maxParticipants: number;
    judges: Judge[];
    prizes?: string;
    rulesAndRegulations: string;
    theme?: string;
    techTags: string[];
}

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'link'],
        [{ 'header': [1, 2, 3, false] }],
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'link',
]

export default function ProjectCreationForm(): React.ReactElement {

    const admin = useAppSelector((state) => state.admin)
    const user = useAppSelector((state) => state.userInfo)

    const navigate = useNavigate();

    const [techTags, setTechTags] = useState<string[]>([])
    const [newTechTag, setNewTechTag] = useState<string>('')

    const {
        register,
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ProjectCreationDetails>({
        defaultValues: {
            name: '',
            description: '',
            registrationStart: '',
            registrationEnd: '',
            start: '',
            maxParticipants: 0,
            judges: [{ name: '' }],
            prizes: '',
            rulesAndRegulations: '',
            theme: '',
            techTags: [],
        }
    });

    const { fields: judgeFields, append: appendJudge, remove: removeJudge } = useFieldArray({
        name: "judges",
        control,
    });

    const addTechTag = (): void => {
        if (newTechTag.trim() !== '' && !techTags.includes(newTechTag.trim())) {
            setTechTags([...techTags, newTechTag.trim()])
            setNewTechTag('')
            clearErrors("techTags")
        } else if (techTags.includes(newTechTag.trim())) {
            setError("techTags", {
                type: "manual",
                message: "Skill already added",
            })
        } else if (newTechTag.trim() === '') {
            setError("techTags", {
                type: "manual",
                message: "Skill cannot be empty",
            })
        }
    }

    const handleLogout = () => {
        navigate("/admin/auth")
    }

    const removeTechTag = (tagToRemove: string): void => {
        setTechTags(techTags.filter(tag => tag !== tagToRemove))
        if (techTags.length <= 1) {
            setError("techTags", {
                type: "manual",
                message: "At least one skill is required",
            });
        }
    }

    const onSubmit: SubmitHandler<ProjectCreationDetails> = (data) => {
        if (techTags.length === 0) {
            alert("At least one skill is required");

            setError("techTags", {
                type: "manual",
                message: "At least one skill is required",
            });
            return;
        } else {
            clearErrors("techTags");
        }

        const formattedData = {
            ...data,
            registrationStart: new Date(data.registrationStart).toISOString(),
            registrationEnd: new Date(data.registrationEnd).toISOString(),
            start: new Date(data.start).toISOString(),
            techTags: techTags,
        };
        console.log(formattedData)
        // Here you would typically send the data to your backend
        const submitProject = async () => {
            try {
                const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/projects/create-project`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formattedData),
                    credentials: "include"
                });
                const resJson = await r.json();
                console.log(resJson);
                if (r.ok) {
                    const response = resJson as ProjectCreationSuccessResponse;
                    alert(response.message);
                    console.log(response);
                } else if (JSON.stringify(r).includes("error")) {
                    // const response = resJson as ProjectCreationErrorResponse;
                    setError("root", {
                        type: "manual",
                        message: "There was an error creating the project",
                    })
                }
            } catch (error) {

            }
        }
        submitProject();
    }

    const watchRegistrationStart = watch("registrationStart");
    const watchRegistrationEnd = watch("registrationEnd");

    if (!user || !admin) {
        return (
            <div className="w-full h-screen">
                <div className="w-full h-3/4 flex flex-col justify-center items-center px-4 sm:px-10 py-20 sm:py-[30vh] ">
                    <h1 className="text-2xl font-bold">You are not authorized to view this page</h1>
                    <h3 className="text-base sm:text-lg text-center">
                        Please         &nbsp;
                        <button onClick={() => handleLogout()} className="bg-transparent border-none font-semibold underline underline-offset-1 ml-1">
                            log in
                        </button> &nbsp;
                        to continue with admin!
                    </h3>
                </div>
            </div>
        )
    }
    // TODO set the both admin cookies and jet_token expireIn 2-3 hours.
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-center">Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input id="name" {...register("name", { required: "Project name is required" })} />
                            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Description is required" }}
                                render={({ field }) => (
                                    <ReactQuill
                                        theme="snow"
                                        modules={modules}
                                        formats={formats}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="registrationStart">Registration Start</Label>
                                <Input
                                    type="date"
                                    id="registrationStart"
                                    {...register("registrationStart", {
                                        required: "Registration start date is required",
                                        validate: (value) => {
                                            const currentDate = new Date().toISOString().split('T')[0];
                                            return value >= currentDate || "Registration start date must be today or later";
                                        }
                                    })}
                                />
                                {errors.registrationStart && <span className="text-red-500 text-sm">{errors.registrationStart.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="registrationEnd">Registration End</Label>
                                <Input
                                    type="date"
                                    id="registrationEnd"
                                    {...register("registrationEnd", {
                                        required: "Registration end date is required",
                                        validate: (value) => {
                                            return value > watchRegistrationStart || "Registration end date must be after the start date";
                                        }
                                    })}
                                />
                                {errors.registrationEnd && <span className="text-red-500 text-sm">{errors.registrationEnd.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start">Project Start Date</Label>
                            <Input
                                type="date"
                                id="start"
                                {...register("start", {
                                    required: "Project start date is required",
                                    validate: (value) => {
                                        return value > watchRegistrationEnd || "Project start date must be after the registration end date";
                                    }
                                })}
                            />
                            {errors.start && <span className="text-red-500 text-sm">{errors.start.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxParticipants">Max Participants</Label>
                            <Input
                                id="maxParticipants"
                                type="number"
                                {...register("maxParticipants", {
                                    required: "Max participants is required",
                                    min: { value: 1, message: "Must be at least 1" }
                                })}
                            />
                            {errors.maxParticipants && <span className="text-red-500 text-sm">{errors.maxParticipants.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Judges</Label>
                            {judgeFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2">
                                    <Input
                                        {...register(`judges.${index}.name` as const, { required: "Judge name is required" })}
                                        placeholder="Judge name"
                                    />
                                    <Button type="button" onClick={() => removeJudge(index)} size="icon" variant="outline">
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" onClick={() => appendJudge({ name: '' })} variant="outline">
                                Add Judge
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prizes">Prizes</Label>
                            <Input id="prizes" {...register("prizes")} placeholder="Enter prize details" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rulesAndRegulations">Rules and Regulations</Label>
                            <Controller
                                name="rulesAndRegulations"
                                control={control}
                                rules={{ required: "Rules and regulations are required" }}
                                render={({ field }) => (
                                    <ReactQuill
                                        theme="snow"
                                        modules={modules}
                                        formats={formats}
                                        {...field}
                                    />
                                )}
                            />
                            {errors.rulesAndRegulations && <span className="text-red-500 text-sm">{errors.rulesAndRegulations.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Input id="theme" {...register("theme")} placeholder="Enter project theme" />
                        </div>

                        <div className="space-y-2">
                            <Label>Tech Tags</Label>
                            <div className="mt-2 flex space-x-2 flex-wrap justify-start flex-row my-2">
                                {techTags.map((tag) => (
                                    <div key={tag} className="flex items-center space-x-1 border-none rounded-full px-3 my-[3px] bg-zinc-950 text-white text-sm">
                                        <span>{tag}</span>
                                        <Button type="button" className='text-white bg-black border-none p-0 hover:bg-none' onClick={() => removeTechTag(tag)} size="sm">
                                            <XIcon className="h-5 w-5 hover:bg-none " />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex  space-x-2">
                                <Input
                                    type="text"
                                    value={newTechTag}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechTag())}
                                    onChange={(e) => setNewTechTag(e.target.value)}
                                    placeholder="Add a tech tag"
                                />
                                <Button type="button" className='text-white bg-black' onClick={addTechTag} size="icon">
                                    <PlusIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            {errors.techTags && <span className="text-red-500 text-sm">{errors.techTags.message}</span>}
                        </div>
                        {errors.root && <span className="text-red-500 text-sm">{errors.root.message}</span>}
                        <div className='flex flex-row justify-center'>
                            <Button type="submit" className='w-full' disabled={isSubmitting}>Create Project</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
