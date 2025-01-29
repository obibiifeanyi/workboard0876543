import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const MemoGeneration = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("Manager");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [paymentItems, setPaymentItems] = useState([{ description: "", amount: "" }]);
  const [accountDetails, setAccountDetails] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserFullName(profile.full_name);
          setFrom(profile.full_name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleAddPaymentItem = () => {
    setPaymentItems([...paymentItems, { description: "", amount: "" }]);
  };

  const handlePaymentItemChange = (index: number, field: "description" | "amount", value: string) => {
    const newItems = [...paymentItems];
    newItems[index][field] = value;
    setPaymentItems(newItems);
  };

  const calculateTotal = () => {
    return paymentItems.reduce((sum, item) => {
      const amount = parseFloat(item.amount.replace(/[^0-9.]/g, "")) || 0;
      return sum + amount;
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSubmit = () => {
    if (!from || !to || !subject || !date || !purpose) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Memo Generated",
      description: "Your memo has been generated and sent to the Manager successfully",
    });

    // Reset form
    setSubject("");
    setDate("");
    setPurpose("");
    setPaymentItems([{ description: "", amount: "" }]);
    setAccountDetails("");
  };

  return (
    <Card className="bg-black/10 dark:bg-white/5 backdrop-blur-lg border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <FileText className="h-5 w-5 text-primary" />
          Generate Memo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center font-bold text-xl mb-6">
          COMMUNICATION TOWERS NIGERIA LIMITED
          <div className="text-lg mt-1">INTERNAL MEMO</div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="from">FROM:</Label>
            <Input
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="bg-white/5 border-white/10"
              readOnly
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="to">TO:</Label>
            <Input
              id="to"
              value={to}
              className="bg-white/5 border-white/10"
              readOnly
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">SUBJECT:</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">DATE:</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="purpose">Purpose:</Label>
          <Textarea
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/10"
          />
        </div>

        <div className="space-y-4">
          <Label>Payment Details:</Label>
          {paymentItems.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => handlePaymentItemChange(index, "description", e.target.value)}
                className="bg-white/5 border-white/10"
              />
              <Input
                placeholder="Amount (₦)"
                value={item.amount}
                onChange={(e) => handlePaymentItemChange(index, "amount", e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddPaymentItem}
            className="w-full"
          >
            Add Payment Item
          </Button>
        </div>

        <div className="text-right font-semibold">
          Total: {formatCurrency(calculateTotal())}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="accountDetails">Payment in favor of (Account Details):</Label>
          <Input
            id="accountDetails"
            placeholder="Account #, Bank, Account Name"
            value={accountDetails}
            onChange={(e) => setAccountDetails(e.target.value)}
            className="bg-white/5 border-white/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="border-t border-dashed border-gray-400 pt-2 text-center">
            {userFullName}
          </div>
          <div className="border-t border-dashed border-gray-400 pt-2 text-center">
            Manager
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full md:w-auto mt-6">
          <Send className="h-4 w-4 mr-2" />
          Generate & Send Memo
        </Button>
      </CardContent>
    </Card>
  );
};