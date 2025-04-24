"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { useProfileStore } from "@/store/profile-store";

export default function ProfileModal() {
  const { open, setOpen } = useModalStore();
  const { profile, updateProfile } = useProfileStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      ...profile,
      ...formData,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            placeholder="Name" 
            required 
            className="w-full focus-visible:ring-1 shadow-none" 
          />
          <Input 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="Email" 
            type="email" 
            required 
            className="w-full focus-visible:ring-1 shadow-none" 
          />
          <Input 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            placeholder="Phone" 
            type="tel" 
            required 
            className="w-full focus-visible:ring-1 shadow-none" 
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              type="submit" 
              variant="outline" 
              className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer"
            >
              Update
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="bg-gray-200 hover:bg-gray-100 cursor-pointer" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
