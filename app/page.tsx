import { migrate } from "@/db/Migrations";
import { dbFileCheck } from "@/db/Path";

export default function Home() {
  // run migrations if file does not exist
  dbFileCheck().then((result) => {
    if (!result) migrate();
  });

  return (
    <div className="">
    </div>
  );
}
