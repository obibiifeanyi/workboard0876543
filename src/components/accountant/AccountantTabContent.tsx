
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AccountantTabContent = () => {
  return (
    <>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Payment received</span>
                  <span className="text-sm font-medium text-green-600">+$2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Office supplies</span>
                  <span className="text-sm font-medium text-red-600">-$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Client invoice</span>
                  <span className="text-sm font-medium text-green-600">+$4,200</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Monthly budget tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Used</span>
                  <span className="text-sm font-medium">$8,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remaining</span>
                  <span className="text-sm font-medium">$3,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                  Create Invoice
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                  Record Payment
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-gray-100 rounded">
                  Generate Report
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="financial-reports">
        <Card>
          <CardHeader>
            <CardTitle>Financial Reports</CardTitle>
            <CardDescription>View and generate financial reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Financial reports content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invoices">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>Manage invoices and billing</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Invoice management content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing</CardTitle>
            <CardDescription>Process and track payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Payment processing content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="inventory">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>Track inventory and assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Inventory management content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Configure account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Account settings content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
