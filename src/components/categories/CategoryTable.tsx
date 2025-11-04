import { convexQuery } from "@convex-dev/react-query"
import { useSuspenseQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { DataTable } from "../ui/DataTable"
import { columns } from "./columns"
import { m } from "@/paraglide/messages"

export default function CategoryTable() {
    const { data, error, isLoading,  } = useSuspenseQuery(convexQuery(api.categories.get, {}))

    if (error) {
        console.error(error)
        return <div className="grow self-center content-center text-zinc-200">
            {m.something_went_wrong()}
        </div>
    }

    return <DataTable columns={columns} data={data} isLoading={isLoading} />
}