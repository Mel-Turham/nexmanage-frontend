"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import Link from "next/link";
import notifications from "@/data/notifications.json";

const Notifications = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    // Ici vous pourriez mettre à jour l'état des notifications
    console.log("Marquer comme lu:", id);
  };

  const markAllAsRead = () => {
    // Ici vous pourriez marquer toutes les notifications comme lues
    console.log("Marquer tout comme lu");
  };

  return (
    <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Tout marquer comme lu
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto no-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${notification.bgColor}`}
                      >
                        <Icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read
                                ? "text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/admin/notifications">
              Voir toutes les notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
