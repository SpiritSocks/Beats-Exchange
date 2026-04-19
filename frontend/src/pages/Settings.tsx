import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Save,
  LogOut,
  Camera,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { me, logout as apiLogout, updateProfile, uploadAvatar, type User as UserType } from "@/api/auth";

const Settings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const { data: user, isLoading } = useQuery<UserType | null>({
    queryKey: ["me", token],
    queryFn: async () => {
      try { return await me(); } catch { return null; }
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAbout(user.about ?? "");
      setAvatarPreview(user.avatar ?? null);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    setAvatarUploading(true);
    try {
      const updated = await uploadAvatar(file);
      queryClient.setQueryData(["me", token], updated);
      // Replace object URL with server URL
      setAvatarPreview(updated.avatar ?? objectUrl);
    } catch {
      // Revert preview on error
      setAvatarPreview(user?.avatar ?? null);
    } finally {
      setAvatarUploading(false);
      // Reset input so the same file can be re-selected
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const updated = await updateProfile({ name, about: about || null });
      queryClient.setQueryData(["me", token], updated);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleLogout = async () => {
    try { await apiLogout(); } catch {}
    localStorage.removeItem("authToken");
    queryClient.clear();
    navigate("/auth");
  };

  if (!token || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="font-black uppercase tracking-widest text-xs">Загрузка настроек...</p>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

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
              <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Настройки</h1>
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Управляй своим аккаунтом</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-none border-2 border-destructive text-destructive font-black uppercase text-[10px] tracking-widest hover:bg-destructive hover:text-destructive-foreground transition-all">
            <LogOut className="w-4 h-4 mr-2" /> Выйти
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
                  <User className="w-4 h-4 mr-2" /> Профиль
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <Lock className="w-4 h-4 mr-2" /> Безопасность
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start rounded-none border-none bg-transparent py-3 px-4 font-black uppercase text-[10px] tracking-widest data-[state=active]:border-l-4 data-[state=active]:border-primary data-[state=active]:bg-primary/10 transition-all">
                  <Bell className="w-4 h-4 mr-2" /> Уведомления
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <TabsContent value="general" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Информация профиля</h2>
                  <div className="grid gap-6">
                    <div className="flex items-center gap-6 mb-4">
                      {/* Avatar */}
                      <div className="relative group">
                        <div className="w-20 h-20 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-primary flex items-center justify-center">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              alt="Аватар"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl font-black italic text-background">
                              {user.name[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        {/* Overlay on hover */}
                        <button
                          type="button"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={avatarUploading}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                        >
                          {avatarUploading
                            ? <Loader2 className="w-6 h-6 text-white animate-spin" />
                            : <Camera className="w-6 h-6 text-white" />
                          }
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={avatarUploading}
                          className="rounded-none border-2 border-foreground font-black uppercase text-[10px]"
                        >
                          {avatarUploading ? (
                            <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Загрузка...</>
                          ) : (
                            <><Camera className="w-3 h-3 mr-2" />Сменить фото</>
                          )}
                        </Button>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          JPG, PNG, WEBP · макс. 5 МБ
                        </p>
                      </div>

                      {/* Hidden file input */}
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Имя пользователя</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-none border-2 border-foreground h-12 font-bold"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Электронная почта</Label>
                      <Input value={user.email} readOnly className="rounded-none border-2 border-foreground h-12 font-bold opacity-60 cursor-not-allowed" />
                    </div>

                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">О себе</Label>
                      <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Расскажите о себе..."
                        className="w-full h-32 rounded-none border-2 border-foreground bg-background p-4 font-bold text-sm outline-none focus:border-primary transition-all resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSave}
                      disabled={saveStatus === "saving"}
                      className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-background font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saveStatus === "saving" ? "Сохранение..." : saveStatus === "saved" ? "Сохранено!" : saveStatus === "error" ? "Ошибка!" : "Сохранить"}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Пароль и безопасность</h2>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Текущий пароль</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-black uppercase text-[10px] tracking-widest">Новый пароль</Label>
                      <Input type="password" placeholder="••••••••" className="rounded-none border-2 border-foreground h-12 font-bold" />
                    </div>

                    <div className="pt-4 border-t-2 border-foreground/10 flex items-center justify-between">
                      <div>
                        <p className="font-black uppercase text-[10px] tracking-widest mb-1">Двухфакторная аутентификация</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Дополнительный уровень защиты аккаунта</p>
                      </div>
                      <Switch />
                    </div>

                    <Button className="w-full h-12 rounded-none border-2 border-foreground bg-primary text-background font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mt-4">
                      Обновить
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="m-0 space-y-6">
                <Card className="rounded-none border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-foreground/10 pb-2">Уведомления</h2>
                  <div className="space-y-6">
                    {[
                      { title: "Продажи", desc: "Уведомлять при покупке бита" },
                      { title: "Сообщения", desc: "Уведомлять о личных сообщениях от покупателей" },
                      { title: "Тренды", desc: "Еженедельная сводка популярных битов" },
                      { title: "Безопасность", desc: "Важные уведомления о безопасности аккаунта" }
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
