import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

const mockApiKeys: APIKey[] = [
  {
    id: "1",
    name: "Development API Key",
    key: "sk_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "2023-01-01",
    lastUsed: "2024-06-11",
  },
  {
    id: "2",
    name: "Production App Key",
    key: "sk_prod_yyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    createdAt: "2023-03-15",
    lastUsed: "2024-06-12",
  },
];

export const APIKeyManagement = () => {
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    alert("API Key copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">API Key Management</h2>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button><Plus className="mr-2 h-4 w-4" /> Generate New Key</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input type="text" value={apiKey.key} readOnly className="font-mono text-xs" />
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(apiKey.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.createdAt}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2"><RotateCcw className="h-4 w-4" /> Regenerate</Button>
                    <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /> Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}; 