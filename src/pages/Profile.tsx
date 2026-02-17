import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  Settings, 
  Plus, 
  Music, 
  PlayCircle, 
  Wallet,
  Mail,
  Edit2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {useNavigate} from "react-router-dom";

const Profile = () => {

    const navigate = useNavigate();

  // Mock current user data

  const user = {
    name: "Vampire Inside",
    email: "vampire@beat-exchange.hub",
    balance: "1,240.50",
    followers: "12.4k",
    plays: "450k",
    tracks: 142,
    bio: "Dark atmosphere specialist. Providing the hardest drill and phonk sounds since 2018. Based in London, UK."
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Header / Cover */}
      <div className="h-48 bg-primary relative border-b-4 border-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full border-60 border-white rounded-full scale-110 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10 flex justify-between items-start">
            <Button onClick={() => navigate("/")} variant="outline" size="sm" className="rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button onClick={() => navigate("/settings")} variant="outline" size="icon" className="rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Settings className="w-4 h-4" />
            </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="space-y-6">
            <Card className="rounded-none border-4 border-foreground bg-card p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-primary border-4 border-foreground flex items-center justify-center text-6xl font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {user.name[0]}
                  </div>
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 rounded-none border-2 border-foreground bg-background w-8 h-8 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
                
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-1">{user.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Mail className="w-3 h-3" /> {user.email}
                </div>

                <div className="w-full grid grid-cols-3 gap-2 border-y-2 border-foreground/10 py-6 mb-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{user.followers}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Followers</span>
                  </div>
                  <div className="flex flex-col items-center border-x-2 border-foreground/10">
                    <span className="text-xl font-black">{user.plays}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Plays</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-black">{user.tracks}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Tracks</span>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-foreground font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all mb-4">
                  <Upload className="w-4 h-4 mr-2" /> Upload New Beat
                </Button>
              </div>
            </Card>

            {/* Wallet Card */}
            <Card className="rounded-none border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-background">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="font-black uppercase italic tracking-tight">Your Balance</span>
                </div>
              </div>
              <div className="text-4xl font-black mb-6 italic text-primary">
                ${user.balance}
              </div>
              <Button className="w-full h-10 rounded-none bg-background text-foreground border-2 border-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                <Plus className="w-4 h-4 mr-1" /> Top Up Balance
              </Button>
            </Card>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-none border-4 border-foreground bg-card p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
              <h2 className="text-2xl font-black uppercase italic tracking-tight border-b-4 border-primary pb-2 inline-block mb-6">About Me</h2>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed mb-8">
                {user.bio}
              </p>

              <div className="space-y-6">
                <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" /> My Tracks
                </h3>
                
                <div className="grid gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 10 }}
                      className="p-4 border-2 border-foreground bg-elevate-1 flex items-center gap-4 group cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="w-10 h-10 bg-primary flex items-center justify-center shrink-0 border-2 border-foreground text-foreground">
                        <PlayCircle className="w-6 h-6 fill-current" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black uppercase italic tracking-tight text-sm">Vampire Drill #{i}</h4>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Uploaded {i} days ago • 140 BPM</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="rounded-none border-foreground/20 font-black uppercase text-[8px]">Drill</Badge>
                        <span className="font-black text-xs">$29.99</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Profile;