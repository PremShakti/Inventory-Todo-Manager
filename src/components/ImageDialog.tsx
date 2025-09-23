import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function ImageDialog({ src, children }: { src: string; children: React.ReactNode }) {
  const downloadImage = () => {
    if (!src) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = src;
    link.download = `inventory-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto p-0">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Your Image</DialogTitle>
          <DialogDescription>
            Here is the image you uploaded. You can download it or close this
            dialog.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          {src ? (
            <Image src={src} alt="Image description" width={500} height={300} />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={downloadImage} disabled={!src}>
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
