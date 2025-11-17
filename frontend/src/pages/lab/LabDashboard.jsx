import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClipboardList, FlaskConical, LogOut, TestTube2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LabDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure only lab users can access this
    if (user?.role !== "lab") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-6">
      <Card className="max-w-7xl mx-auto border border-gray-200 dark:border-gray-800 shadow-lg">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2 text-sky-600 font-semibold text-xl">
            <FlaskConical className="w-6 h-6" />
            <span>Lab Dashboard</span>
          </div>
            
        </CardHeader>

        {/* Tabs */}
        <CardContent className="pt-6">
          <Tabs value={tab} onValueChange={setTab}>

            {/* Overview Tab */}
            <TabsContent value="dashboard" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Manage Tests Card */}
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-sky-400"
                  onClick={() => navigate("/lab/manage-tests")}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <TestTube2 className="w-10 h-10 text-sky-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Manage Tests
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Add, edit, or delete medical tests and update pricing or report times.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 text-sky-600 border-sky-300 hover:bg-sky-50"
                    >
                      Go to Manage Tests
                    </Button>
                  </CardContent>
                </Card>

                {/* Manage Bookings Card */}
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-sky-400"
                  onClick={() => navigate("/lab/manage-test-bookings")}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <FileText className="w-10 h-10 text-sky-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Test Bookings
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      View, update, or manage patient test bookings and upload reports.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 text-sky-600 border-sky-300 hover:bg-sky-50"
                    >
                      Go to Bookings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Placeholder Tabs */}
            <TabsContent value="manage-tests" className="mt-6">
              <div className="text-center text-gray-600">
                Redirecting to <b>Manage Tests</b>...
              </div>
            </TabsContent>

            <TabsContent value="manage-test-bookings" className="mt-6">
              <div className="text-center text-gray-600">
                Redirecting to <b>Test Bookings</b>...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
