import { motion } from "framer-motion";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducers } from "@/api/producers";
import type { PaginatedResponse, Producer } from "@/api/types";
import { useState } from "react";

export default function Producers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data } = useQuery<PaginatedResponse<Producer>>({
    queryKey: ["producers", page],
    queryFn: () => fetchProducers(page),
  });

  const producers = data?.data ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">

      <div className="bg-card/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-auto px-6 py-6 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-6">
            <Button onClick={() => navigate("/")} variant="ghost" size="icon" className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all bg-background">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none self-start">Producers</h1>
            </div>
          </div>

          <div className="flex-end flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group md:w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name..."
                className="pl-10 h-12 bg-background border-2 border-foreground rounded-none focus:ring-0 focus:border-primary transition-all uppercase text-[10px] font-black w-full"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-none border-2 border-foreground">
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* Filters */}
        <div className="flex flex-row justify-center gap-4 mb-10 ">
          {["All Creators"].map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className={`rounded-none border-2 border-foreground px-4 py-2 text-[10px] font-black uppercase cursor-pointer transition-all hover:bg-primary hover:text-white ${filter === "All Creators" ? "bg-primary text-white" : "bg-card"}`}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {producers.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-foreground/20">
            <p className="font-black uppercase italic text-muted-foreground tracking-widest">No producers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {producers.map((producer, index) => (
              <motion.div
                key={producer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="group flex flex-col h-full rounded-none border-2 border-foreground bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,51,102,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => navigate(`/producers/${producer.id}`)}
                >
                  <div className="p-6 pt-10 flex-1">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-20 h-20 bg-primary border-4 border-primary flex items-center justify-center text-4xl font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-white group-hover:text-primary transition-colors">
                        {producer.name[0]}
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-black uppercase italic tracking-tight mb-1 group-hover:text-primary transition-colors leading-tight">
                        {producer.name}
                      </h2>
                      {producer.email && (
                        <p className="text-[10px] font-bold uppercase text-muted-foreground">{producer.email}</p>
                      )}
                    </div>

                    {producer.about && (
                      <p className="text-xs text-muted-foreground text-center line-clamp-2">{producer.about}</p>
                    )}
                  </div>

                  <div className="border-t-2 border-foreground grid grid-cols-1">
                    <Button
                      className="col-span-3 rounded-none h-12 font-black uppercase text-[10px] tracking-widest bg-primary text-black hover:text-primary hover:bg-white transition-colors border-none"
                      onClick={(e) => { e.stopPropagation(); navigate(`/producers/${producer.id}`); }}
                    >
                      View Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex justify-center gap-4 mt-12">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs"
            >
              Previous
            </Button>
            <span className="flex items-center font-black uppercase text-xs tracking-widest">
              Page {data.current_page} of {data.last_page}
            </span>
            <Button
              variant="outline"
              disabled={page >= data.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-none border-2 border-foreground font-black uppercase text-xs"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
