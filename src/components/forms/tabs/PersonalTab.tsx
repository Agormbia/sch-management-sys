"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PersonalTab = React.memo(({ form }: { form: any }) => {
  console.log("Rendering PersonalTab"); // Debug render
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...form.register("fullName")}
          placeholder="Enter full name"
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-red-500">{form.formState.errors.fullName.message}</p>
        )}
      </div>
      {/* Other personal form fields */}
    </div>
  );
});

PersonalTab.displayName = 'PersonalTab';
export default PersonalTab;
