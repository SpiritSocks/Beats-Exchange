import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Music, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState("buyer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In mockup mode, we just redirect
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border-100 border-primary rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-8">
            <div onClick={() => navigate("/")}  className="w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:scale-110 transition-transform">
              <span className="text-3xl font-black italic">B</span>
            </div>
        </div>

        <Card className="rounded-none border-4 border-foreground bg-card shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2 text-center">
            {isLogin ? "Welcome Back" : "Join the Hub"}
          </h1>
          <p className="text-center text-muted-foreground font-bold text-[10px] uppercase tracking-widest mb-8">
            {isLogin ? "Enter your credentials" : "Create your account to start"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black uppercase text-[10px] tracking-widest">Email Address</Label>
              <Input 
                required 
                type="email" 
                placeholder="PRODUCER@EXCHANGE.COM" 
                className="rounded-none border-2 border-foreground h-12 bg-background font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-black uppercase text-[10px] tracking-widest">Password</Label>
              <Input 
                required 
                type="password" 
                placeholder="••••••••" 
                className="rounded-none border-2 border-foreground h-12 bg-background font-bold"
              />
            </div>

            {!isLogin && (
              <div className="space-y-4 pt-2 pb-2">
                <Label className="font-black uppercase text-[10px] tracking-widest">Select your role</Label>
                <RadioGroup defaultValue="buyer" onValueChange={setRole} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                    <Label
                      htmlFor="buyer"
                      className="flex flex-col items-center justify-between rounded-none border-2 border-foreground bg-background p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                    >
                      <ShoppingBag className="mb-2 h-6 w-6" />
                      <span className="text-[10px] font-black uppercase">Buyer</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="seller" id="seller" className="peer sr-only" />
                    <Label
                      htmlFor="seller"
                      className="flex flex-col items-center justify-between rounded-none border-2 border-foreground bg-background p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                    >
                      <Music className="mb-2 h-6 w-6" />
                      <span className="text-[10px] font-black uppercase">Seller</span>
                    </Label>
                  </div>
                </RadioGroup>
                <div className="p-3 bg-muted border-2 border-foreground/10 flex gap-3 items-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="text-[9px] font-bold text-muted-foreground uppercase leading-tight">
                    {role === 'seller' 
                      ? "Sellers can upload beats, manage leases, and buy from others." 
                      : "Buyers can explore, purchase, and lease beats from any producer."}
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-14 rounded-none border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-primary text-foreground font-black uppercase tracking-widest text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </Card>

          <Button onClick = {() => navigate("/")} variant="ghost" className="mt-6 w-full font-black uppercase text-[10px] tracking-widest gap-2">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Button>
      </motion.div>
    </div>
  );
}

export default Auth;