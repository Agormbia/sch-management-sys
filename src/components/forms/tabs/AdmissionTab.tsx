"use client";

import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdmissionTab = React.memo(({ form }: { form: any }) => {
  console.log("Rendering AdmissionTab"); // Debug render
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Admission Date</Label>
        {/* Admission date and other fields */}
      </div>
    </div>
  );
});

AdmissionTab.displayName = 'AdmissionTab';
export default AdmissionTab;
