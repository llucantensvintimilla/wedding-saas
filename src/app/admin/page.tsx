import Link from "next/link";
import { signOut } from "./actions";

export default function AdminHomePage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/bodas" className="font-medium">
            Weddings
          </Link>
          <Link href="/admin/colaboradores" className="text-black/60">
            Partners
          </Link>
          <Link href="/admin/leads" className="text-black/60">
            Leads
          </Link>
          <Link href="/admin/pendientes" className="text-black/60">
            Pending Access
          </Link>
        </nav>
        <form action={signOut}>
          <button className="text-sm text-black/60 hover:text-black">
            Sign Out
          </button>
        </form>
      </div>

      <p className="mt-4 text-sm text-black/60">
        The internal control center for OurWeding. Manage weddings, partners,
        and lead conversion from one place.
      </p>
    </div>
  );
}
