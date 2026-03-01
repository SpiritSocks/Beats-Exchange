import { AnimatePresence, motion } from "framer-motion";
import { 
  ArrowLeft, 
  Upload, 
  Settings, 
  Plus, 
  Music, 
  Wallet,
  Mail,
  Play,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {useNavigate} from "react-router-dom";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


const Profile = () => {
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
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

  const GENRES = ["Drill", "Phonk", "Trap", "Lo-fi", "Boom Bap", "Hyperpop", "Techno", "R&B"];

  const closeUpload = () => {
    setIsUploadOpen(false);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

                <Button
                  onClick={() => setIsUploadOpen(true)}
                  className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-background font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all mb-4"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload New Beat
                </Button>
              </div>
            </Card>

            {/* Wallet Card */}
            <Card className="rounded-none border-4 border-foreground bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-foreground">
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
                        <Play className="w-6 h-6 fill-background" />
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

      {/* Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={closeUpload}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-background border-4 border-foreground p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Upload Beat</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Share your sound with the world</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeUpload}
                  className="rounded-none border-2 border-foreground hover:bg-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  closeUpload();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Beat Name</Label>
                    <Input 
                      placeholder="e.g. DARK NIGHT" 
                      className="rounded-none border-2 border-foreground bg-elevate-1 focus:border-primary transition-all font-bold uppercase italic"
                      data-testid="input-beat-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Genre</Label>
                    <Select>
                      <SelectTrigger className="rounded-none border-2 border-foreground bg-elevate-1 font-bold uppercase">
                        <SelectValue placeholder="Select Genre" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-foreground">
                        {GENRES.map(genre => (
                          <SelectItem key={genre} value={genre.toLowerCase()} className="font-bold uppercase italic">
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">BPM</Label>
                    <Input 
                      type="number" 
                      placeholder="140" 
                      className="rounded-none border-2 border-foreground bg-elevate-1 font-bold"
                      data-testid="input-beat-bpm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest">Base Price ($)</Label>
                    <Input 
                      type="number" 
                      placeholder="29.99" 
                      className="rounded-none border-2 border-foreground bg-elevate-1 font-bold"
                      data-testid="input-beat-price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Description</Label>
                  <Textarea 
                    placeholder="Tell us about the mood, energy, or inspiration..." 
                    className="rounded-none border-2 border-foreground bg-elevate-1 font-bold h-24"
                    data-testid="textarea-beat-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest">Upload File (.wav, .mp3)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".wav,.mp3"
                    className="hidden"
                    data-testid="input-beat-file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setSelectedFileName(file ? file.name : null);
                    }}
                  />
                  <div
                    className="border-4 border-dashed border-foreground/20 p-8 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setSelectedFileName(file.name);
                      }
                    }}
                  >
                    <div className="w-16 h-16 bg-elevate-1 border-2 border-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Music className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="font-black uppercase italic text-sm">
                        {selectedFileName
                          ? `Selected file: ${selectedFileName}`
                          : "Drag & Drop or Click to Browse"}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">
                        Maximum file size: 50MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={closeUpload}
                    className="flex-1 rounded-none h-14 border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 rounded-none h-14 bg-primary text-background border-2 border-foreground font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Publish Beat
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;