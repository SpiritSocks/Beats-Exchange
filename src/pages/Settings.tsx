import { useState } from "react";
import { motion } from "framer-motion";

import { 
  ArrowLeft, 
  User, 
  Lock, 
  Bell, 
  CreditCard,
  Save,
  LogOut
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Settings = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Header */}
      <div className="border-b-4 border-foreground bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
              <Button onClick={() => navigate("/profile")} variant="ghost" size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all bg-background">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Settings</h1>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Manage your identity and hub experience</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-none border-2 border-destructive text-destructive font-black uppercase text-[10px] tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-48">
              <TabsList className="flex flex-col h-auto bg-transparent border-l-4 border-foreground/10 p-0 rounded-none items-start space-y-1">
                <TabsTrigger value="general" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <User className="w-4 h-4 mr-2" /> General
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <Lock className="w-4 h-4 mr-2" /> Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <Bell className="w-4 h-4 mr-2" /> Alerts
                </TabsTrigger>
                <TabsTrigger value="billing" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <CreditCard className="w-4 h-4 mr-2" /> Billing
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <TabsContent value="general" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Profile Information</h2>
                  <div className="grid gap-6">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-20 h-20 bg-primary border-4 border-foreground flex items-center justify-center text-4xl font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        V
                      </div>
                      <Button variant="outline" className="rounded-none border-2 border-foreground font-black uppercase text-[10px]">Change Photo</Button>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Username</Label>
                      <Input defaultValue="Vampire Inside" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Email Address</Label>
                      <Input defaultValue="vampire@beat-exchange.hub" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Bio</Label>
                      <textarea className="w-full h-32 rounded-none border-2 border-foreground bg-background p-4 font-bold text-sm outline-none focus:border-primary transition-all resize-none">
                        Dark atmosphere specialist. Providing the hardest drill and phonk sounds since 2018. Based in London, UK.
                      </textarea>
                    </div>

                    <Button className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                      <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Password & Security</h2>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Current Password</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">New Password</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>
                    
                    <div className="pt-4 border-t-2 border-foreground/10 flex items-center justify-between">
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest mb-1">Two-Factor Authentication</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>

                    <Button className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mt-4">
                      Update Security
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Notifications</h2>
                  <div className="space-y-6">
                    {[
                      { title: "Sales Alerts", desc: "Notify me when someone buys a beat" },
                      { title: "New Messages", desc: "Notify me of direct messages from buyers" },
                      { title: "Marketplace Trends", desc: "Weekly summary of what's hot" },
                      { title: "Security Alerts", desc: "Critical account security notifications" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-black uppercase text-[10px] tracking-widest mb-1">{item.title}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={i > 2} />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

export default Settings;