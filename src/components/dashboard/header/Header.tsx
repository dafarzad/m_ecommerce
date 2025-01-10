import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Header() {
  return (
    <div className="fixed z-[20] md:right-[300px] left-0 top-0 right-0 p-4 bg-background/80 backdrop-blur-md flex items-center gap-4 border-b-[1px]">
      <div className="flex items-center gap-2 mr-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
