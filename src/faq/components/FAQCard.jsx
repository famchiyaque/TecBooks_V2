import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/components/lib/utils";

function FAQCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
        "border border-gray-200 hover:border-blue-400"
      )}
      onClick={() => onClick(item.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md">
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-center text-lg font-semibold text-gray-800">
            {item.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Additional content can be added here if needed */}
      </CardContent>
    </Card>
  );
}

export default FAQCard;
