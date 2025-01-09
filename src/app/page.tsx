import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex justify-end">
        <ThemeToggle />
      </div>
      welcome to the web app!
    </div>
  );
}
