"use client";

import ProfileModal from "@/components/admin-ui/profile/profile-modal";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/modal-store";

const SettingsPage = () => {
  const { setOpen } = useModalStore();
  const { data: session } = useSession();
  const { profile, fetchProfile, loading, error } = useProfileStore();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session, fetchProfile]);

  return (
    <section className="h-full flex-1 overflow-auto p-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Settings</h3>
          <Button variant="outline" className="bg-primary text-white hover:bg-primary/90 hover:text-white cursor-pointer" onClick={() => setOpen(true)}>
            Edit Profile
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground px-10 py-20 border rounded-lg">
            <span className="text-lg font-semibold">No profile details found</span>
            <p className="text-sm mt-1">Please try again later.</p>
          </div>
        ) : error ? (
          <p className="text-red-500 font-medium">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
            <div>
              <span className="text-sm font-medium">Full Name</span>
              <span className="text-sm block">{profile.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm block">{profile.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Phone</span>
              <span className="text-sm block">{profile.phone}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Role</span>
              <span className="text-sm block capitalize">{profile.role}</span>
            </div>
          </div>
        )}

        <ProfileModal />
      </div>
    </section>
  );
};

export default SettingsPage;
