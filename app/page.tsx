import { migrate } from "@/db/Migrations";
import { dbFileCheck } from "@/db/Path";

export default function Home() {
  // run migrations if file does not exist
  dbFileCheck().then((result) => {
    if (!result) migrate();
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    </div>
  );
}
