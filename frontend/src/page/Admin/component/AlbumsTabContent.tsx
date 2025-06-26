
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Library } from "lucide-react"
import Albumstable from "./Albumstable"
import AddalbumDialog from "./AddalbumDialog"

function AlbumsTabContent() {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-violet-500" />
            </CardTitle>
            <CardDescription>Manage Your Album Collection</CardDescription>
          </div>
          <AddalbumDialog/>
        </div>
      </CardHeader>

      <CardContent>
        <Albumstable/>
      </CardContent>
      
    </Card>
  )
}

export default AlbumsTabContent
