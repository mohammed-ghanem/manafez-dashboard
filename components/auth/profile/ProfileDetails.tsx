"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchProfile } from "@/store/auth/thunkActions/ActUser";

function ProfileDetails() {
  const dispatch = useAppDispatch();
  // Use user slice instead of auth slice
  const { user, status, error } = useAppSelector((state) => state.auth);


  useEffect(() => {
    dispatch(ActFetchProfile());
  }, [dispatch]);

  if (status === 'loading') {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">❌ {error}</p>;
  }

  if (!user) {
    return <p className="text-gray-500">No profile data found.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        {user.mobile && (
          <p>
            <span className="font-medium">Phone:</span> {user.mobile}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileDetails;
