"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useModalStore } from "@/store/modal-store";
import { useProfileStore } from "@/store/profile-store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone } from "lucide-react";

export default function ProfileModal() {
  const { open, setOpen } = useModalStore();
  const { profile, updateProfile, loading, error } = useProfileStore();

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ ...profile, ...formData });
      toast.success("Profile updated successfully");
      setOpen(false);
    } catch (err) {
      console.error("[UPDATE_PROFILE_ERROR]", err);
      toast.error("Failed to update profile");
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="mt-4 flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Update Profile</DialogTitle>
        </DialogHeader>
        {loading && !profile ? (
          renderSkeleton()
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="name"
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Enter your full name" 
                  required 
                  className="w-full pl-9 focus-visible:ring-1 shadow-none" 
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="Enter your email" 
                  type="email" 
                  required 
                  className="w-full pl-9 focus-visible:ring-1 shadow-none" 
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  id="phone"
                  value={formData.phone} 
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="Enter your phone number" 
                  type="tel" 
                  required 
                  className="w-full pl-9 focus-visible:ring-1 shadow-none" 
                  disabled={loading}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                type="submit" 
                variant="outline" 
                className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer" 
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="bg-gray-200 hover:bg-gray-100 cursor-pointer" 
                onClick={() => setOpen(false)} 
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
