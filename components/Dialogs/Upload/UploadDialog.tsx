import { useState, DragEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import DatePicker from "../../ui/datepicker";
import { Input } from "../../ui/input";
import moment from "moment"
import { uploadImages } from "@/services/api";
import { imageAssociatedWithIds, RowData, UploadImagesAPIResponse } from "@/models/images";
import { toast } from "@/components/ui/use-toast";
import ButtonLoading from "@/components/ui/loading-button";
interface UploadDialogProps {
    onUpload: (data: imageAssociatedWithIds[], files: Array<any>) => void;
    existingImages: RowData[];
}

const UploadDialog = ({ onUpload, existingImages }: UploadDialogProps) => {
    const [dragActive, setDragActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const handleDateChange = (date: Date): void => {
        setSelectedDate(date);
    };
    const handleTimeChange = (time: string): void => {
        setSelectedTime(time);
    };
    const handleDrag = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleClick = (): void => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemove = (index: number): void => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    function isFormDataEmpty(formData: FormData) {
        // Get an iterator of all key/value pairs in the FormData
        const iterator = formData.entries();

        // Check if the iterator has any entries
        return iterator.next().done;
    }
    const uploadPictures = async (): Promise<void> => {
        let duplicateImages: boolean = false
        setButtonLoading(true)
        const formData = new FormData()
        files.forEach(file => {
            const imageExists = existingImages.findIndex(image => image.originalFileName === file.name)
            if (imageExists === -1) {
                formData.append("files", file)
            } else {
                duplicateImages = true
            }
        })
        // If there is only one image and that too a duplicate
        if (duplicateImages && isFormDataEmpty(formData)) {
            toast({
                variant: "destructive",
                title: "Duplicate images found",
                description: "Please rename duplicate images to upload again"
            });
            setButtonLoading(false)
            return 
        }
        if (selectedDate) {
            const date = moment(selectedDate);

            if (selectedTime) {
                const [hours, minutes] = selectedTime?.split(':').map(Number);
                date.hours(hours);
                date.minutes(minutes);
            }
            const isoString = date.toISOString();
            formData.append("scheduleDateTime", isoString)
        }
        try {
            const response = await uploadImages(formData)
            const imagesWithIds: Array<imageAssociatedWithIds> = files.map((file) => {
                const imageWithId: UploadImagesAPIResponse = response.data.images.find((uploadedImage: UploadImagesAPIResponse) => uploadedImage.filename === file.name)
                return { id: imageWithId.id, originalFileName: file.name }
            })
            onUpload(imagesWithIds, files)
            resetState()
            setIsOpen(false)
            toast({
                variant: "success",
                title: "Images processed",
            });
            if (duplicateImages)
                toast({
                    variant: "destructive",
                    title: "Duplicate images found",
                    description: "Please rename duplicate images to upload again"
                });
            setButtonLoading(false)
        } catch (error: any) {
            setButtonLoading(false)
            toast({
                variant: "destructive",
                title: error.response.data.error ?? "Something went wrong",
            });
        }
    }
    const resetState = () => {
        setFiles([])
        setSelectedDate(null)
        setSelectedTime(null)
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex gap-2 border" onClick={() => setIsOpen(true)}>Upload</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Upload Your Files</DialogTitle>
                    <DialogDescription>
                        Upload Files and then Choose Date & Time to Publish
                    </DialogDescription>
                </DialogHeader>
                <div
                    className={`h-[15vh] border-2 border-dashed ${dragActive ? "border-blue-500" : "border-gray-200"} rounded-lg justify-center flex gap-2 p-6 items-center cursor-pointer`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <CloudUpload className="text-[#9CA3AF] w-8" />
                    <span className="text-sm font-medium text-gray-500">Drag File</span>
                    <input
                        type="file"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={handleChange}
                        accept="image/*"
                        multiple
                    />
                </div>
                {files.length > 0 && (
                    <div className="mt-4 text-sm space-y-2">
                        <Label className="text-sm font-medium">Selected Files:</Label>
                        <ul className="custom-scrollbar overflow-x-auto max-h-[15vh] flex gap-2 flex-col">
                            {files.map((file, index) => (
                                <li key={index} className="flex gap-2 justify-between items-center">
                                    <p>{file.name}</p>
                                    <Button variant="ghost" className="border" size="sm" onClick={() => handleRemove(index)}>Remove</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex flex-col w-[60%] gap-2">
                    <div className="flex flex-col gap-1">
                        <Label>Publish date</Label>
                        <DatePicker selectedDate={selectedDate}
                            onDateChange={handleDateChange} />
                    </div>
                    <div>
                        <Label>Publish time</Label>
                        <Input
                            aria-label="--:--"
                            type="time"
                            onChange={(e) => handleTimeChange(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex w-full">
                        {!buttonLoading ?
                            <Button disabled={buttonLoading} onClick={() => uploadPictures()} className="w-full">Save</Button>
                            : <ButtonLoading />
                        }
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default UploadDialog;
