
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Star } from "lucide-react";

export const PerformanceReviews = () => {
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Performance Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-4 w-4" />
                  Completed Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">This quarter</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-4 w-4" />
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Due this month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-4 w-4" />
                  Average Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Out of 5</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
