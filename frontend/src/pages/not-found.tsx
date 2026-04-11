import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans flex items-center justify-center p-6 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 max-w-2xl w-full text-center"
      >

        <div className="relative inline-block mb-8">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none uppercase italic tracking-tighter stroke-2 stroke-foreground" style={{ WebkitTextStroke: '4px currentColor' }}>
            404
          </h1>
        </div>

        <div className="space-y-8">
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-muted-foreground max-w-lg mx-auto leading-tight">
            The beat you're looking for has been dropped, or maybe it never existed in this dimension.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button onClick={() => navigate("/")} className="h-16 px-3 md:w-56 rounded-none border-4 border-foreground bg-primary text-background text-xl font-black uppercase italic tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-3 group">
                <Home className="w-auto h-6 group-hover:animate-bounce" />
                Home
              </Button>
              <Button onClick={() => navigate('/explore')} variant="outline" className="h-16 px-3 md:w-56 rounded-none border-4 border-foreground bg-background text-foreground text-xl font-black uppercase italic tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,51,102,1)] transition-all flex items-center gap-3 group">
                <Search className="w-auto h-6 group-hover:rotate-12 transition-transform group-hover:animate-spin" />
                Explore Beats
              </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;