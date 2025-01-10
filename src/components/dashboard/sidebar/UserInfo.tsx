import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Props = {
  user: User | null;
};

export default function UserInfo({ user }: Props) {
  return (
    <div>
      <div>
        <Button
          className="w-full mt-5 mb-4 flex items-center justify-between py-10"
          variant="ghost"
        >
          <div className="flex items-center text-right gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.picture}
                alt={`${user?.firstName} ${""}`}
              />
              <AvatarFallback className="bg-primary text-white">
                {"John doe"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-y-1">
              John doe
              <span className="text-muted-foreground">09133361478</span>
              <span className="w-fit">
                <Badge variant="secondary" className="capitalize">
                  کاربر
                </Badge>
              </span>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
}
