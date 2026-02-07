import { motion } from "framer-motion";
import { ArrowLeft, Search, Star, MessageSquare, SlidersHorizontal, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRODUCERS = [
  { id: 1, name: "Vampire Inside", genres: ["Phonk", "Drill"], beats: 142, rating: 4.9, location: "London, UK", active: "Today" },
  { id: 2, name: "Xiu Digital", genres: ["Trap", "Techno"], beats: 89, rating: 4.8, location: "Berlin, DE", active: "2h ago" },
  { id: 3, name: "Digi 4", genres: ["Hyperpop", "Drill"], beats: 65, rating: 4.7, location: "Tokyo, JP", active: "Yesterday" },
  { id: 4, name: "Vinyl User", genres: ["Lo-fi", "Boom Bap"], beats: 210, rating: 5.0, location: "Brooklyn, NY", active: "Today" },
  { id: 5, name: "Killa Prod", genres: ["Detroit", "Trap"], beats: 45, rating: 4.6, location: "Detroit, MI", active: "3d ago" },
  { id: 6, name: "Neon Ghost", genres: ["Synthwave", "Ambient"], beats: 78, rating: 4.9, location: "Los Angeles, CA", active: "Today" },
  { id: 7, name: "Phantom Bass", genres: ["Dubstep", "Grime"], beats: 112, rating: 4.8, location: "Bristol, UK", active: "1h ago" },
  { id: 8, name: "Signal Flow", genres: ["House", "Techno"], beats: 95, rating: 4.7, location: "Amsterdam, NL", active: "Today" },
];

export default function Producers() {
    
    const navigate = useNavigate();
return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      <div className="bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-auto px-6 py-6 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
                <Button onClick = {() => navigate("/")} variant="ghost" size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all bg-background">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none self-start">Producers</h1>
                    <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Intent-driven Discovery Directory</p>
                </div>
            </div>
          
          <div className="flex-end flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group md:w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by genre, style, or name..." 
                className="pl-10 h-12 bg-background border-2 border-foreground rounded-none focus:ring-0 focus:border-primary transition-all uppercase text-[10px] font-black w-full"
              />
            </div>
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-35 h-12 rounded-none border-2 border-foreground bg-background font-black uppercase text-[10px]">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground">
                  <SelectItem value="phonk">Phonk</SelectItem>
                  <SelectItem value="drill">Drill</SelectItem>
                  <SelectItem value="trap">Trap</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {["All Creators", "Top Rated", "Trending", "Near You", "New Blood", "Verified"].map((filter) => (
            <Badge 
              key={filter} 
              variant="outline" 
              className={`rounded-none border-2 border-foreground px-4 py-2 text-[10px] font-black uppercase cursor-pointer transition-all hover:bg-primary hover:text-white ${filter === "All Creators" ? "bg-primary text-white" : "bg-card"}`}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {/* The discovery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCERS.map((producer, index) => (
            <motion.div
              key={producer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group flex flex-col h-full rounded-none border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,51,102,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className={`w-2 h-2 rounded-full ${producer.active === "Today" || producer.active.includes('h') ? "bg-green-500" : "bg-muted-foreground"}`} />
                  <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{producer.active}</span>
                </div>

                <div className="p-6 pt-10 flex-1">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-primary border-4 border-foreground flex items-center justify-center text-4xl font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white group-hover:text-primary transition-colors">
                      {producer.name[0]}
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight mb-1 group-hover:text-primary transition-colors leading-tight">
                      {producer.name}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-1 text-primary">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-black">{producer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">{producer.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {producer.genres.map(genre => (
                        <Badge key={genre} variant="outline" className="rounded-none border-foreground/20 text-[8px] font-black uppercase px-2 py-0.5 bg-muted/30">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-foreground/10">
                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Catalog</span>
                      <span className="text-[10px] font-black uppercase">{producer.beats} Beats</span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-foreground grid grid-cols-4">
                  <Button className="col-span-3 rounded-none h-12 font-black uppercase text-[10px] tracking-widest bg-foreground text-background hover:bg-primary hover:text-white transition-colors border-none">
                    View Catalog
                  </Button>
                  <Button variant="ghost" className="col-span-1 rounded-none h-12 border-l-2 border-foreground hover:bg-primary hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
