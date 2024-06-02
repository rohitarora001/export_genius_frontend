import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
interface ViewImageProps {
    onClose: () => void;
    isOpen: boolean;
    imageSrc: string;
}

const ViewImage = ({ isOpen, onClose, imageSrc }: ViewImageProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <div className="image">
                    <img src={imageSrc} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ViewImage;
