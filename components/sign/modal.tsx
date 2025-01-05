"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts/app";
import GoogleSignInButton from './GoogleSignInButton';

export default function SignModal() {
  const { showSignModal, setShowSignModal } = useAppContext();

  return (
    <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <GoogleSignInButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
