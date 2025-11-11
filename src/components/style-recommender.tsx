"use client";

import { useState } from "react";
import { getPersonalizedRecommendations } from "@/ai/flows/personalized-style-recommendations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/lib/placeholder-data";

const stylePreferences = [
  "Minimalist",
  "Vintage",
  "Streetwear",
  "Bohemian",
  "Classic",
  "Sporty",
];

// Simulate browsing history
const browsingHistory = products.slice(0, 3).map(p => p.name);

export function StyleRecommender() {
  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateRecommendations = async () => {
    if (!preference) {
      toast({
        variant: "destructive",
        title: "No preference selected",
        description: "Please select a style preference to get recommendations.",
      });
      return;
    }
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await getPersonalizedRecommendations({
        browsingHistory,
        preferences: preference,
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <Wand2 className="h-6 w-6" />
        </div>
        <CardTitle className="text-3xl font-headline">Your Personal Stylist</CardTitle>
        <CardDescription>
          Tell us your style, and our AI will suggest items you'll love.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="style-preference">What's your preferred style?</Label>
          <Select value={preference} onValueChange={setPreference}>
            <SelectTrigger id="style-preference">
              <SelectValue placeholder="Select a style..." />
            </SelectTrigger>
            <SelectContent>
              {stylePreferences.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <p className="text-xs text-muted-foreground mt-2">Based on your recent views of: {browsingHistory.join(', ')}</p>
        </div>
        {recommendations.length > 0 && (
          <div className="pt-4">
            <h4 className="font-semibold mb-2">We think you'll like:</h4>
            <ul className="list-disc list-inside bg-muted p-4 rounded-md space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerateRecommendations}
          disabled={isLoading}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Find My Style
        </Button>
      </CardFooter>
    </Card>
  );
}
