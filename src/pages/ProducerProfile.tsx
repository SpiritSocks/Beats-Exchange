import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Play, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";

// Mock data shared across the app
const PRODUCERS = [
  { id: 1, name: "Vampire Inside", genres: ["Phonk", "Drill"], beats: 142, rating: 4.9, location: "London, UK", bio: "Dark atmosphere specialist. Providing the hardest drill and phonk sounds since 2018." },
  { id: 2, name: "Xiu Digital", genres: ["Trap", "Techno"], beats: 89, rating: 4.8, location: "Berlin, DE", bio: "Electronic fusion producer focused on high-energy trap and techno hybrids." },
  { id: 3, name: "Digi 4", genres: ["Hyperpop", "Drill"], beats: 65, rating: 4.7, location: "Tokyo, JP", bio: "Experimental sounds from the future. Merging hyperpop aesthetics with heavy drill bass." },
  { id: 4, name: "Vinyl User", genres: ["Lo-fi", "Boom Bap"], beats: 210, rating: 5.0, location: "Brooklyn, NY", bio: "Keeping the golden era alive. Analog warmth and dusty samples." },
];

const MOCK_BEATS = [
  { id: 1, title: "LUNA ECLIPSE", price: "$29.99", bpm: 140, genre: "Drill" },
  { id: 2, title: "VOID RUNNER", price: "$49.99", bpm: 128, genre: "Phonk" },
  { id: 3, title: "CYBER HEART", price: "$34.99", bpm: 160, genre: "Trap" },
];

const ProducerProfile = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const producer = PRODUCERS.find(p => p.id === Number(id)) || PRODUCERS[0];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* Hero Header */}
      <div className="h-64 bg-primary relative overflow-hidden border-b-4 border-foreground">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full border-20 border-white rounded-full scale-150 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-end pb-8 relative z-10">
          <Button onClick={() => navigate("/producers")} variant="outline" className="absolute top-6 left-6 rounded-none border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 bg-background border-4 border-foreground flex items-center justify-center text-6xl font-black italic shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {producer.name[0]}
            </div>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-foreground bg-background px-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
                {producer.name}
              </h1>
              <div className="flex items-center gap-4 text-background font-black uppercase text-xs tracking-widest">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {producer.location}</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {producer.rating} Rating</span>
                <span>{producer.beats} Beats Uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="rounded-none border-2 border-foreground p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-xl font-black uppercase italic mb-4">About</h2>
            <p className="text-sm font-bold text-muted-foreground leading-relaxed">
              {producer.bio}
            </p>
            <div className="flex gap-4 mt-6">
              <Button size="icon" variant="outline" className="rounded-none border-2 border-foreground"><Share2 className="w-4 h-4" /></Button>
              <Button className="flex-1 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-xs">Follow</Button>
            </div>
          </Card>

          <Card className="rounded-none border-2 border-foreground p-6 bg-card">
            <h2 className="text-xl font-black uppercase italic mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {producer.genres.map(g => (
                <Badge key={g} className="rounded-none bg-primary text-background font-black uppercase text-[10px]">{g}</Badge>
              ))}
              <Badge variant="outline" className="rounded-none border-foreground/20 font-black uppercase text-[10px]">Verified</Badge>
              <Badge variant="outline" className="rounded-none border-foreground/20 font-black uppercase text-[10px]">Pro Seller</Badge>
            </div>
          </Card>
        </div>

        {/* Beats List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tight border-b-4 border-primary pb-2 inline-block mb-4">Uploaded Beats</h2>

          <div className="space-y-4">
            {MOCK_BEATS.map((beat) => (
              <motion.div
                key={beat.id}
                whileHover={{ x: 10 }}
                className="p-4 border-2 border-foreground bg-card flex items-center gap-4 group cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,51,102,1)] transition-all"
              >
                <div className="w-12 h-12 bg-primary flex items-center justify-center shrink-0 border-2 border-foreground">
                  <Play className="w-6 h-6 fill-background" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black uppercase italic tracking-tight">{beat.title}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{beat.genre} • {beat.bpm} BPM</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg">{beat.price}</span>
                  <Button size="icon" variant="ghost" className="hover:text-primary"><Heart className="w-5 h-5" /></Button>
                  <Button size="sm" className="rounded-none font-black uppercase text-[10px] border-2 border-foreground">Buy</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProducerProfile;