"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Gift, Sparkles, Star } from "lucide-react";
import Image from "next/image";
const OneTimePopUp = ({
  hideButton,
  children,
  primeMember = false
}: {
  hideButton?: boolean;
  children?: React.ReactNode;
    primeMember?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (hideButton) {
      const checkAndShowPopup = () => {
        const today = new Date().toDateString();
        const lastShown = localStorage.getItem("durga-puja-popup-shown");

        if (lastShown !== today) {
          // Show popup after a short delay
          setTimeout(() => {
            setIsOpen(true);
            localStorage.setItem("durga-puja-popup-shown", today);
          }, 2000); // 2 seconds delay
        }
      };

      checkAndShowPopup();
    }
  }, [hideButton]);

  const handleClaimMembership = async () => {
    setClaiming(true);
    try {
      const response = await axios.post("/api/membership");
      if (response.data.success) {
        toast.success(response.data.message);
        setIsOpen(false);
      } else {
        toast.info(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to claim membership");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!hideButton && (
        <DialogTrigger asChild>
          {children ? (
            <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
              {children}
            </div>
          ) : (
            <Button
              variant="ghost"
              className="fixed bottom-4 right-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white shadow-lg hover:from-amber-500 hover:via-orange-600 hover:to-red-600"
            >
              <Gift className="mr-2 h-5 w-5" />
              Special Offer
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md border-2 border-amber-200 dark:border-amber-800">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-amber-200 dark:border-amber-700">
            {/* <Star className="h-10 w-10 text-white" /> */}
            <Image src={'/titleicon.png'} alt="Title Icon" width={80} height={80} />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            🔱 Happy Durga Puja! 🙏 🪔
          </DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            🌺 Celebrate this auspicious Durga Puja with Maa Durga's divine
            blessings! 🌺
            <br />
            <span className="font-semibold text-primary">
              {" "}
              🔱 Get Free Prime Membership 🔱
            </span>{" "}
            with our special Durga Puja offer.
            <br />
            <span className="text-sm italic">
              🥁 Experience divine grace with exclusive benefits & protection!
              🥁
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-red-950/30 p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-amber-600" />
            🔱 Special Durga Puja Benefits:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center">
              <span className="text-amber-600 mr-2">🎁</span>3 Months Free Prime
              Membership 🔱
            </li>
            <li className="flex items-center">
              <span className="text-orange-600 mr-2">🪔</span>
              Exclusive Durga Puja Discounts & Offers 🥁
            </li>
            <li className="flex items-center">
              <span className="text-red-600 mr-2">🌺</span>
              Priority Customer Support & Service 🙏
            </li>
            <li className="flex items-center">
              <span className="text-amber-600 mr-2">✨</span>
              Early Access to Festival Deals & Benefits 🔱
            </li>
            <li className="flex items-center text-xs italic">
              <span className="text-orange-600 mr-2">🥁</span>
              Blessed by Maa Durga's divine grace & protection 🌺
            </li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {primeMember ? (
            <>
              <Button
                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white flex-1 shadow-lg"
                disabled
              >
                ✨ You're Already a Prime Member! 👑
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-green-300 hover:bg-green-50"
                onClick={() => setIsOpen(false)}
              >
                🙏 Close
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white flex-1 shadow-lg"
                onClick={handleClaimMembership}
                disabled={claiming}
              >
                {claiming ? "Claiming..." : "🔱 Claim Free Membership 🙏"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-amber-300 hover:bg-amber-50"
                onClick={() => setIsOpen(false)}
              >
                🪔 Maybe Later
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OneTimePopUp;
